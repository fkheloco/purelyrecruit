# Sample Co — Client Agent Package

This is a portable, self-contained agent workspace for Sample Co. You can copy this entire folder to share access with team members who only work on this client. No other client data is included.

Contents
- Claude.md — main training file for the agent
- brand/ — brand assets and guidelines (colors, typography, templates)
- knowledge-base/ — company, sales, process docs
- training-files/ — drop new docs for continual learning
- outputs/ — proposals, reports, presentations generated for the client

Quick Start
1) Review and customize Claude.md with Sample Co specifics
2) Fill brand/colors/brand-colors.md and brand/guidelines/*
3) Populate knowledge-base/company/* and sales/*
4) Drop any source files into training-files/ and have your agent process them

Optional Apps
If this package includes an app (e.g., a dashboard), it will be inside outputs/<app-name>. See that folder's README.md for install and run instructions. Environment variables should be listed in that app's .env.example.

Security & Access
- Share only this folder to limit access to Sample Co materials
- Avoid committing secrets; use .env files locally and keep .env.* out of version control

Maintenance
- Keep knowledge-base current
- Use training-files to teach the agent new information
- Update brand guidelines after any rebrand
