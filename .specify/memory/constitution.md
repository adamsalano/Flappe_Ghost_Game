<!--
Sync Impact Report
Version change: uninitialized → 1.0.0
Modified principles: Five template placeholders replaced with eight Flappy Ghost principles:
  I. Test-Driven Development; II. Separation of Game Logic and Presentation;
  III. Modular JavaScript; IV. Independently Testable Game Logic;
  V. Node.js Built-In Testing; VI. Minimal Dependencies;
  VII. Requirement Traceability; VIII. Approved MVP Scope.
Added sections: Technical Constraints; Development Workflow.
Removed sections: None.
Follow-up TODOs: None.
-->
# Flappy Ghost Constitution

## Core Principles

### I. Test-Driven Development (NON-NEGOTIABLE)
Every feature MUST demonstrate the Red-Green-Refactor cycle: add or update a test
for an approved acceptance criterion, run it and observe the expected failure,
implement only the minimum code needed to pass, then refactor while keeping the
test passing. The change summary MUST record the failing and passing test runs.
Tests MUST NOT be deleted, weakened, or altered merely to make an implementation
pass. A test may change when its approved requirement or acceptance criterion
changes.

### II. Separation of Game Logic and Presentation
Game rules and state transitions MUST be separate from rendering and browser
interaction. Game logic MUST NOT depend directly on the DOM, canvas, or browser
event APIs; rendering and input code MUST call into the game logic through clear
interfaces. This boundary keeps game behavior testable without a browser.

### III. Modular JavaScript
JavaScript MUST be organized into focused, cohesive modules with clear names and
readable control flow. Modules MUST expose only the interfaces needed by their
callers. Implementations MUST favor straightforward code over unnecessary
abstraction.

### IV. Independently Testable Game Logic
Game logic MUST be testable without rendering a screen or launching a browser.
Tests MUST be able to exercise state changes and game rules deterministically;
time, randomness, and other external inputs MUST be controllable where they
affect those rules.

### V. Node.js Built-In Testing
Automated tests MUST use Node.js built-in testing capabilities, including
`node:test` and `node:assert/strict`. Tests MUST run without a third-party test
framework.

### VI. Minimal Dependencies
The project MUST avoid unnecessary third-party dependencies and prefer
capabilities built into JavaScript, the browser, and Node.js. A new runtime or
development dependency MUST be justified by an approved MVP requirement before
it is added.

### VII. Requirement Traceability
Every feature MUST trace to an approved requirement and at least one explicit
acceptance criterion in the MVP specification. Tests and implementation work
MUST identify the criteria they satisfy.

### VIII. Approved MVP Scope
The project MUST implement only functionality in the approved MVP specification.
A feature outside that scope MUST NOT be implemented until the MVP specification
is updated and approved.

## Technical Constraints
The game MUST use JavaScript and keep browser-specific behavior at the
presentation and input boundary. Game logic MUST remain independent of browser
globals so Node.js can test it. No framework or third-party library is required
unless an approved MVP requirement justifies it.

## Development Workflow
Work MUST begin from an approved MVP requirement and acceptance criterion.
Developers MUST follow and record the Red-Green-Refactor cycle for each feature.
Review MUST verify requirement traceability, test coverage of acceptance
criteria, the logic/presentation boundary, and compliance with MVP scope.

## Governance
This constitution governs project implementation and review. Amendments MUST
include a written rationale and receive project-owner approval before they take
effect. Changes to the MVP specification do not authorize work beyond its
approved scope until that specification is approved.

The constitution follows semantic versioning:
- **MAJOR** for backward-incompatible changes to principles or governance.
- **MINOR** for new principles or materially expanded requirements.
- **PATCH** for clarifications and non-semantic wording changes.

Every feature review MUST check compliance with this constitution. Any
non-compliance MUST be corrected or resolved through an approved amendment
before the feature is accepted.

**Version**: 1.0.0 | **Ratified**: 2026-11-26 | **Last Amended**: 2026-11-26
