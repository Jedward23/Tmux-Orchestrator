"""
Abstract base class for installable components
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Tuple, Optional, Any
from pathlib import Path
import json


class Component(ABC):
    """Base class for all installable components"""
    
    def __init__(self, install_dir: Optional[Path] = None):
        """
        Initialize component with installation directory
        
        Args:
            install_dir: Target installation directory (defaults to ~/.claude)
        """
        from .. import DEFAULT_INSTALL_DIR
        self.install_dir = install_dir or DEFAULT_INSTALL_DIR
        self._metadata = None
        self._dependencies = None
        self._files_to_install = None
        self._settings_modifications = None
    
    @abstractmethod
    def get_metadata(self) -> Dict[str, str]:
        """
        Return component metadata
        
        Returns:
            Dict containing:
                - name: Component name
                - version: Component version
                - description: Component description
                - category: Component category (core, command, integration, etc.)
        """
        pass
    
    @abstractmethod
    def validate_prerequisites(self) -> Tuple[bool, List[str]]:
        """
        Check prerequisites for this component
        
        Returns:
            Tuple of (success: bool, error_messages: List[str])
        """
        pass
    
    @abstractmethod
    def get_files_to_install(self) -> List[Tuple[Path, Path]]:
        """
        Return list of files to install
        
        Returns:
            List of tuples (source_path, target_path)
        """
        pass
    
    @abstractmethod
    def get_settings_modifications(self) -> Dict[str, Any]:
        """
        Return settings.json modifications to apply
        
        Returns:
            Dict of settings to merge into settings.json
        """
        pass
    
    @abstractmethod
    def install(self, config: Dict[str, Any]) -> bool:
        """
        Perform component-specific installation logic
        
        Args:
            config: Installation configuration
            
        Returns:
            True if successful, False otherwise
        """
        pass
    
    @abstractmethod
    def uninstall(self) -> bool:
        """
        Remove component
        
        Returns:
            True if successful, False otherwise
        """
        pass
    
    @abstractmethod
    def get_dependencies(self) -> List[str]:
        """
        Return list of component dependencies
        
        Returns:
            List of component names this component depends on
        """
        pass
    
    def update(self, config: Dict[str, Any]) -> bool:
        """
        Update component (default: uninstall then install)
        
        Args:
            config: Installation configuration
            
        Returns:
            True if successful, False otherwise
        """
        # Default implementation: uninstall and reinstall
        if self.uninstall():
            return self.install(config)
        return False
    
    def get_installed_version(self) -> Optional[str]:
        """
        Get currently installed version of component
        
        Returns:
            Version string if installed, None otherwise
        """
        settings_file = self.install_dir / "settings.json"
        if settings_file.exists():
            try:
                with open(settings_file, 'r') as f:
                    settings = json.load(f)
                component_name = self.get_metadata()['name']
                return settings.get('components', {}).get(component_name, {}).get('version')
            except Exception:
                pass
        return None
    
    def is_installed(self) -> bool:
        """
        Check if component is installed
        
        Returns:
            True if installed, False otherwise
        """
        return self.get_installed_version() is not None
    
    def validate_installation(self) -> Tuple[bool, List[str]]:
        """
        Validate that component is correctly installed
        
        Returns:
            Tuple of (success: bool, error_messages: List[str])
        """
        errors = []
        
        # Check if all files exist
        for _, target in self.get_files_to_install():
            if not target.exists():
                errors.append(f"Missing file: {target}")
        
        # Check version in settings
        if not self.get_installed_version():
            errors.append("Component not registered in settings.json")
        
        return len(errors) == 0, errors
    
    def get_size_estimate(self) -> int:
        """
        Estimate installed size in bytes
        
        Returns:
            Estimated size in bytes
        """
        total_size = 0
        for source, _ in self.get_files_to_install():
            if source.exists():
                if source.is_file():
                    total_size += source.stat().st_size
                elif source.is_dir():
                    total_size += sum(f.stat().st_size for f in source.rglob('*') if f.is_file())
        return total_size
    
    def __str__(self) -> str:
        """String representation of component"""
        metadata = self.get_metadata()
        return f"{metadata['name']} v{metadata['version']}"
    
    def __repr__(self) -> str:
        """Developer representation of component"""
        return f"<{self.__class__.__name__}({self.get_metadata()['name']})>"