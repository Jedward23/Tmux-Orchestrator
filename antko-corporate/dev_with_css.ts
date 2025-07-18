#!/usr/bin/env deno run -A --watch=static/,routes/,islands/,components/

// Build CSS first
import "./build_css.ts";

// Then start the dev server
import "./dev.ts";