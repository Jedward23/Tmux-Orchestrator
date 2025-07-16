"""
Base installer logic for SuperClaude installation system
"""

from typing import List, Dict, Optional, Set, Tuple, Any
from pathlib import Path
import json
import shutil
import tempfile
from datetime import datetime
from .component import Component


class Installer:
    """Main installer orchestrator"""
    
    def __init__(self, install_dir: Optional[Path] = None, dry_run: bool = False):
        """
        Initialize installer
        
        Args:
            install_dir: Target installation directory
            dry_run: If True, only simulate installation
        """
        from .. import DEFAULT_INSTALL_DIR
        self.install_dir = install_dir or DEFAULT_INSTALL_DIR
        self.dry_run = dry_run
        self.components: Dict[str, Component] = {}
        self.installed_components: Set[str] = set()
        self.failed_components: Set[str] = set()
        self.skipped_components: Set[str] = set()
        self.backup_path: Optional[Path] = None
        
    def register_component(self, component: Component) -> None:
        """
        Register a component for installation
        
        Args:
            component: Component instance to register
        """
        metadata = component.get_metadata()
        self.components[metadata['name']] = component
        
    def register_components(self, components: List[Component]) -> None:
        """
        Register multiple components
        
        Args:
            components: List of component instances
        """
        for component in components:
            self.register_component(component)
    
    def resolve_dependencies(self, component_names: List[str]) -> List[str]:
        """
        Resolve component dependencies in correct installation order
        
        Args:
            component_names: List of component names to install
            
        Returns:
            Ordered list of component names including dependencies
            
        Raises:
            ValueError: If circular dependencies detected or unknown component
        """
        resolved = []
        resolving = set()
        
        def resolve(name: str):
            if name in resolved:
                return
                
            if name in resolving:
                raise ValueError(f"Circular dependency detected involving {name}")
                
            if name not in self.components:
                raise ValueError(f"Unknown component: {name}")
                
            resolving.add(name)
            
            # Resolve dependencies first
            for dep in self.components[name].get_dependencies():
                resolve(dep)
                
            resolving.remove(name)
            resolved.append(name)
        
        # Resolve each requested component
        for name in component_names:
            resolve(name)
            
        return resolved
    
    def validate_system_requirements(self) -> Tuple[bool, List[str]]:
        """
        Validate system requirements for all registered components
        
        Returns:
            Tuple of (success: bool, error_messages: List[str])
        """
        errors = []
        
        # Check disk space (500MB minimum)
        try:
            stat = shutil.disk_usage(self.install_dir.parent)
            free_mb = stat.free / (1024 * 1024)
            if free_mb < 500:
                errors.append(f"Insufficient disk space: {free_mb:.1f}MB free (500MB required)")
        except Exception as e:
            errors.append(f"Could not check disk space: {e}")
        
        # Check write permissions
        test_file = self.install_dir / ".write_test"
        try:
            self.install_dir.mkdir(parents=True, exist_ok=True)
            test_file.touch()
            test_file.unlink()
        except Exception as e:
            errors.append(f"No write permission to {self.install_dir}: {e}")
        
        return len(errors) == 0, errors
    
    def create_backup(self) -> Optional[Path]:
        """
        Create backup of existing installation
        
        Returns:
            Path to backup archive or None if no existing installation
        """
        if not self.install_dir.exists():
            return None
            
        if self.dry_run:
            return self.install_dir / "backup_dryrun.tar.gz"
            
        # Create backup directory
        backup_dir = self.install_dir / "backups"
        backup_dir.mkdir(exist_ok=True)
        
        # Create timestamped backup
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_name = f"superclaude_backup_{timestamp}"
        backup_path = backup_dir / f"{backup_name}.tar.gz"
        
        # Create temporary directory for backup
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_backup = Path(temp_dir) / backup_name
            
            # Ensure temp backup directory exists
            temp_backup.mkdir(parents=True, exist_ok=True)
            
            # Copy all files except backups directory
            for item in self.install_dir.iterdir():
                if item.name != "backups":
                    try:
                        if item.is_file():
                            shutil.copy2(item, temp_backup / item.name)
                        elif item.is_dir():
                            shutil.copytree(item, temp_backup / item.name)
                    except Exception as e:
                        # Log warning but continue backup process
                        print(f"Warning: Could not backup {item.name}: {e}")
            
            # Create archive only if there are files to backup
            if any(temp_backup.iterdir()):
                shutil.make_archive(
                    backup_path.with_suffix(''),
                    'gztar',
                    temp_dir,
                    backup_name
                )
            else:
                # Create empty backup file to indicate backup was attempted
                backup_path.touch()
                print(f"Warning: No files to backup, created empty backup marker: {backup_path.name}")
        
        self.backup_path = backup_path
        return backup_path
    
    def install_component(self, component_name: str, config: Dict[str, Any]) -> bool:
        """
        Install a single component
        
        Args:
            component_name: Name of component to install
            config: Installation configuration
            
        Returns:
            True if successful, False otherwise
        """
        if component_name not in self.components:
            raise ValueError(f"Unknown component: {component_name}")
            
        component = self.components[component_name]
        
        # Skip if already installed
        if component_name in self.installed_components:
            return True
            
        # Check prerequisites
        success, errors = component.validate_prerequisites()
        if not success:
            print(f"Prerequisites failed for {component_name}:")
            for error in errors:
                print(f"  - {error}")
            self.failed_components.add(component_name)
            return False
        
        # Perform installation
        try:
            if self.dry_run:
                print(f"[DRY RUN] Would install {component_name}")
                success = True
            else:
                success = component.install(config)
                
            if success:
                self.installed_components.add(component_name)
                # Component handles its own metadata registration
            else:
                self.failed_components.add(component_name)
                
            return success
            
        except Exception as e:
            print(f"Error installing {component_name}: {e}")
            self.failed_components.add(component_name)
            return False
    
    def install_components(self, component_names: List[str], config: Optional[Dict[str, Any]] = None) -> bool:
        """
        Install multiple components in dependency order
        
        Args:
            component_names: List of component names to install
            config: Installation configuration
            
        Returns:
            True if all successful, False if any failed
        """
        config = config or {}
        
        # Resolve dependencies
        try:
            ordered_names = self.resolve_dependencies(component_names)
        except ValueError as e:
            print(f"Dependency resolution error: {e}")
            return False
        
        # Validate system requirements
        success, errors = self.validate_system_requirements()
        if not success:
            print("System requirements not met:")
            for error in errors:
                print(f"  - {error}")
            return False
        
        # Create backup if updating
        if self.install_dir.exists() and not self.dry_run:
            print("Creating backup of existing installation...")
            self.create_backup()
        
        # Install each component
        all_success = True
        for name in ordered_names:
            print(f"\nInstalling {name}...")
            if not self.install_component(name, config):
                all_success = False
                # Continue installing other components even if one fails
        
        # Post-installation validation
        if all_success and not self.dry_run:
            self._run_post_install_validation()
        
        return all_success
    
    def uninstall_component(self, component_name: str) -> bool:
        """
        Uninstall a single component
        
        Args:
            component_name: Name of component to uninstall
            
        Returns:
            True if successful, False otherwise
        """
        if component_name not in self.components:
            raise ValueError(f"Unknown component: {component_name}")
            
        component = self.components[component_name]
        
        try:
            if self.dry_run:
                print(f"[DRY RUN] Would uninstall {component_name}")
                return True
            else:
                success = component.uninstall()
                # Component handles its own metadata removal
                return success
        except Exception as e:
            print(f"Error uninstalling {component_name}: {e}")
            return False
    
    def _update_settings_registry(self, component: Component) -> None:
        """Update settings.json with component registration"""
        if self.dry_run:
            return
            
        settings_file = self.install_dir / "settings.json"
        settings = {}
        
        if settings_file.exists():
            with open(settings_file, 'r') as f:
                settings = json.load(f)
        
        # Update components registry
        if 'components' not in settings:
            settings['components'] = {}
            
        metadata = component.get_metadata()
        settings['components'][metadata['name']] = {
            'version': metadata['version'],
            'installed_at': datetime.now().isoformat(),
            'category': metadata.get('category', 'unknown')
        }
        
        # Update framework.components array for operation compatibility
        if 'framework' not in settings:
            settings['framework'] = {}
        if 'components' not in settings['framework']:
            settings['framework']['components'] = []
        
        # Add component to framework.components if not already present
        component_name = metadata['name']
        if component_name not in settings['framework']['components']:
            settings['framework']['components'].append(component_name)
        
        # Save settings
        settings_file.parent.mkdir(parents=True, exist_ok=True)
        with open(settings_file, 'w') as f:
            json.dump(settings, f, indent=2)
    
    def _remove_from_settings_registry(self, component_name: str) -> None:
        """Remove component from settings.json registry"""
        if self.dry_run:
            return
            
        settings_file = self.install_dir / "settings.json"
        if not settings_file.exists():
            return
            
        with open(settings_file, 'r') as f:
            settings = json.load(f)
        
        # Remove from components registry
        if 'components' in settings and component_name in settings['components']:
            del settings['components'][component_name]
        
        # Remove from framework.components array for operation compatibility
        if 'framework' in settings and 'components' in settings['framework']:
            if component_name in settings['framework']['components']:
                settings['framework']['components'].remove(component_name)
            
        with open(settings_file, 'w') as f:
            json.dump(settings, f, indent=2)
    
    def _run_post_install_validation(self) -> None:
        """Run post-installation validation for all installed components"""
        print("\nRunning post-installation validation...")
        
        all_valid = True
        for name in self.installed_components:
            component = self.components[name]
            success, errors = component.validate_installation()
            
            if success:
                print(f"  ✓ {name}: Valid")
            else:
                print(f"  ✗ {name}: Invalid")
                for error in errors:
                    print(f"    - {error}")
                all_valid = False
        
        if all_valid:
            print("\nAll components validated successfully!")
        else:
            print("\nSome components failed validation. Check errors above.")
    
    def get_installation_summary(self) -> Dict[str, Any]:
        """
        Get summary of installation results
        
        Returns:
            Dict with installation statistics and results
        """
        return {
            'installed': list(self.installed_components),
            'failed': list(self.failed_components),
            'skipped': list(self.skipped_components),
            'backup_path': str(self.backup_path) if self.backup_path else None,
            'install_dir': str(self.install_dir),
            'dry_run': self.dry_run
        }