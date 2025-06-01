name: 🔄 Pull Request - 🇬🇧
description: Contribute changes to the RDR2RP Business License Generator
title: "[PR]: "
labels: ["needs-review"]
body:
  - type: markdown
    attributes:
      value: |
        Thank you for contributing to the RDR2RP Business License Generator!
        
        Please fill out this form completely so we can efficiently review your pull request.

  - type: checkboxes
    id: terms
    attributes:
      label: Before submitting
      description: Please confirm the following points
      options:
        - label: I have merged the latest version of the main branch
          required: true
        - label: I have tested my changes locally
          required: true
        - label: I have not broken existing functionality
          required: true
        - label: My code follows existing conventions
          required: true

  - type: textarea
    id: description
    attributes:
      label: Description of Changes
      description: What was changed and why?
      placeholder: |
        Example: Improved validation for URL inputs in the business license generator.
        Fixes Issue #123 - URLs are now properly validated and users receive
        better feedback for invalid inputs.
    validations:
      required: true

  - type: dropdown
    id: change-type
    attributes:
      label: Type of Change
      description: What kind of change is this?
      options:
        - Bug Fix (fixes an issue)
        - New Feature (adds new functionality)
        - Enhancement (improves existing functionality)
        - UI/UX Improvement (design/user experience)
        - Performance Optimization (speed improvement)
        - Code Refactoring (code structure without functional changes)
        - Documentation (README, comments, etc.)
        - Build/CI (GitHub Actions, build process)
        - Security (security improvement)
    validations:
      required: true

  - type: dropdown
    id: affected-components
    attributes:
      label: Affected Components
      description: Which parts of the application are affected?
      options:
        - Business License Generator
        - Person Verification System
        - Application Processing
        - Import Functionality
        - Navigation/Layout
        - Global Components (utils.js, CSS)
        - Documentation
        - Build/Deployment
      multiple: true
    validations:
      required: true

  - type: checkboxes
    id: testing
    attributes:
      label: Testing Checklist
      description: Which tests have been performed?
      options:
        - label: All generators work correctly
          required: false
        - label: Import functionality tested
          required: false
        - label: Copy-to-clipboard works
          required: false
        - label: Responsive design checked on mobile devices
          required: false
        - label: Cross-browser compatibility tested (Chrome, Firefox, Safari)
          required: false
        - label: Form validation works properly
          required: false
        - label: All links and navigation function correctly
          required: false

  - type: checkboxes
    id: rdr2rp-compliance
    attributes:
      label: RDR2RP-Specific Verification
      description: RDR2RP authenticity and functionality
      options:
        - label: Discord formatting is preserved
          required: false
        - label: Date format (1899) is correct
          required: false
        - label: City-business assignments are accurate
          required: false
        - label: License number format is correct
          required: false
        - label: Western terminology and style maintained
          required: false

  - type: textarea
    id: breaking-changes
    attributes:
      label: Breaking Changes
      description: Are there any changes that affect existing functionality?
      placeholder: |
        If yes, describe:
        - What changes
        - How it affects users
        - Migration/workaround steps
        
        If no, write "No breaking changes"

  - type: textarea
    id: screenshots
    attributes:
      label: Screenshots/Videos (optional)
      description: Visual changes or new features
      placeholder: |
        Add screenshots or GIFs to show visual changes.
        You can simply drag & drop images here.

  - type: textarea
    id: additional-context
    attributes:
      label: Additional Context
      description: Other relevant information
      placeholder: |
        - Related issues
        - Design decisions
        - Known limitations
        - Future improvements

  - type: dropdown
    id: urgency
    attributes:
      label: Urgency
      description: How urgent is this pull request?
      options:
        - Low (can wait)
        - Medium (should be merged soon)
        - High (important improvement)
        - Critical (fixes critical bug)
    validations:
      required: true

  - type: markdown
    attributes:
      value: |
        ---
        
        **🎯 Review Guidelines:**
        - Code will be reviewed for functionality, style, and RDR2RP compatibility
        - All tests must pass successfully
        - Breaking changes require additional documentation
        
        **🤝 Thank you for your contribution to the RDR2RP community!**