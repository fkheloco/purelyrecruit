# Training Files - Knowledge Base Update System

## How This Works

This folder provides a simple workflow for continuously updating the Brio Solutions agent's knowledge base with new information.

### Workflow

**1. Add New Files Here**
Drop any files you want the agent to learn from directly into the `training-files/` folder:
* PDFs (reports, proposals, case studies)
* Word documents (.docx)
* Spreadsheets (.xlsx, .csv)
* Presentations (.pptx)
* Text files (.txt, .md)
* Images with text (screenshots, diagrams)
* Any other relevant documents

**2. Ask the Agent to Process Them**
Simply say:
```
"Process the new training files and update the knowledge base"
```

**3. Agent Will Automatically:**
* Read and analyze all files in this folder
* Extract relevant information (company details, projects, processes, people, etc.)
* Determine which knowledge base files should be updated
* Update or create appropriate knowledge base files with the new information
* Move processed files to `previous-training/` folder with timestamp
* Provide you a summary of what was learned and what was updated

**4. Review the Updates**
Check the knowledge base files to see what was added or updated.

---

## What the Agent Looks For

### Company Information
* New projects or case studies
* Client testimonials and feedback
* Company achievements and milestones
* Service offerings changes
* Organizational updates

### People & Team
* New team members and their bios
* Updated contact information
* Role changes or promotions
* Team structure updates

### Processes & Workflows
* New standard operating procedures
* Updated processes and methodologies
* Tools and systems being used
* Best practices and lessons learned

### Sales & Marketing
* New value propositions
* Competitive intelligence
* Market positioning updates
* Success stories and wins
* Proposal templates and examples

### Projects & Clients
* Completed project details
* Client feedback and testimonials
* Project outcomes and metrics
* Case study information
* Reference-able work

---

## Example Usage

### Example 1: After Winning a Project
```
User: "We just won the LAX terminal renovation project. Here's the contract."
[Drops contract PDF into training-files/]

User: "Process the new training file"

Agent:
- Reads contract
- Extracts: project name, value, scope, duration, key personnel
- Updates: knowledge-base/clients/project-types.md
- Creates: knowledge-base/clients/lax-terminal-project.md
- Moves: contract to previous-training/2026-02-06_lax-contract.pdf
- Reports: "Added LAX Terminal Renovation project ($X value, Y duration) to knowledge base"
```

### Example 2: New Team Member
```
User: "Here's the bio for our new senior PM"
[Drops bio.docx into training-files/]

User: "Update the knowledge base with the new training file"

Agent:
- Reads bio
- Extracts: name, title, experience, skills, contact info
- Updates: knowledge-base/leadership/team.md
- Moves: bio to previous-training/2026-02-06_new-pm-bio.docx
- Reports: "Added John Smith, Senior PM to the team documentation"
```

### Example 3: Multiple Documents
```
User: "I'm dropping several proposal docs, a case study, and meeting notes"
[Drops 5 files into training-files/]

User: "Process all the training files"

Agent:
- Reads all 5 files
- Identifies relevant information from each
- Updates multiple knowledge base files accordingly
- Moves all to previous-training/ with timestamps
- Reports: "Processed 5 files: updated 3 KB files, created 1 new case study"
```

---

## Tips for Best Results

### File Naming
* Use descriptive file names
* Include dates when relevant
* Example: `2026-02-LAX-proposal-final.pdf` (better than `proposal.pdf`)

### File Types
* The agent can read most common formats
* For images, ensure text is clear and readable
* For scanned PDFs, OCR quality matters

### Context
* Briefly tell the agent what the files are about
* Example: "Processing 3 RFP responses from Q1 2026"
* Helps the agent understand context and extract better

### Frequency
* Process files weekly or after major events
* Don't let too many pile up
* Regular small updates are better than large batches

---

## Archive System

**previous-training/** folder structure:
```
previous-training/
├── 2026-02-06_lax-contract.pdf
├── 2026-02-06_new-pm-bio.docx
├── 2026-02-10_q1-proposals.zip
└── 2026-02-15_client-feedback.xlsx
```

Files are automatically timestamped when moved, making it easy to:
* Track when information was added
* Find original source documents
* Audit knowledge base updates
* Reference historical documents

---

## Knowledge Base File Mapping

Files typically update these knowledge base locations:

| Information Type | Knowledge Base Location |
|-----------------|------------------------|
| Company info, mission | `knowledge-base/company/company-overview.md` |
| Team members, leadership | `knowledge-base/leadership/team.md` |
| New services | `knowledge-base/services/service-catalog.md` |
| Value props, positioning | `knowledge-base/sales/value-propositions.md` |
| Project details, case studies | `knowledge-base/clients/project-types.md` or new case study file |
| Processes, workflows | `knowledge-base/processes/[specific-process].md` |
| Client lists, testimonials | `knowledge-base/clients/` (new or existing files) |

---

## Maintenance

### Monthly Review
* Check `previous-training/` to see what's been processed
* Review knowledge base updates for accuracy
* Archive very old training files if needed

### Quality Check
* Periodically ask agent to summarize what it knows about key topics
* Verify critical information is accurate and up-to-date
* Flag any outdated information for removal

### Cleanup
* Old files in `previous-training/` can be moved to permanent archive
* Keep at least 3-6 months of processed files for reference
* Compress or zip older batches to save space

---

## Current Status

**Files to Process:** 0
**Last Processed:** Never (newly created system)
**Total Processed:** 0

**Ready to use!** Just drop files in the `training-files/` folder and ask the agent to process them.
