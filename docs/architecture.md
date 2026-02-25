# AMAR Engine Architecture

---

## Overview

**AMAR Engine** is a unified framework designed for:

- Multi-path world construction
- Structural standardization through metaclass inference
- Modular physics execution

The system enforces a strict separation between:

- Information
- Structural ontology
- Persistent world specification
- Runtime execution

This separation enables:

- Portability
- Versionability
- Modular backend replacement

---

## High-Level Architecture

```
Input Layer
↓
Information Pool
↓
AME Admin (Metaclass Inference)
↓
AMAR WORLD (Persistent Standard)
↓
GENIS Runtime Adapter
↓
Genesis Physics Core
```

Each layer has strictly defined responsibilities and does not overlap with adjacent layers.

---

## Input Layer

The engine supports multiple world construction paths:

- Scanner-based capture
- Language-based generation (LLM)
- Structured model pipelines (e.g., Tahoe)

All inputs generate **raw structured information**, not finalized world structures.

**Key constraint:**

- No metaclass inference occurs at this stage

The Input Layer is purely generative and descriptive.

---

## Information Pool

The **Information Pool** is a neutral structured domain.

### Contains

- Object fragments
- Spatial hints
- Semantic signals
- Raw measurements

### Does Not Contain

- Metaclass assignments
- Physics bindings
- Execution semantics

The pool represents **potential structure**, not resolved ontology.

---

## AME Admin — Structural Arbitration Layer

AME Admin performs the critical transformation:

```
Raw Information → Stable Structural Ontology
```

### Responsibilities

- Internal model-driven metaclass inference
- Parameter normalization
- Structural constraint resolution
- Dependency validation

Metaclass decisions are finalized at this layer.

This is the structural authority of the system.

---

## AMAR WORLD Standard

**AMAR WORLD** is the persistent structured output of the system.

It is:

- A directory-based world format
- Metaclass-resolved
- Parameter-normalized
- Dependency-explicit
- Versionable and portable

AMAR WORLD can exist independently of runtime execution.

It represents a complete executable world specification.

### Example Structure

```
/amar_world
  /objects
  /environment
  /dependencies
  world.meta.json
```

---

## Runtime Execution Layer

Execution is modular and backend-replaceable.

```
AMAR WORLD
↓
GENIS Adapter
↓
Genesis Physics Engine
↓
Interactive Simulation
```

### Roles

- **GENIS Adapter**
  Bridges structural representation and physics simulation

- **Genesis Physics Engine**
  Performs numerical computation and physical state updates

Runtime backends are replaceable without altering world specification.

---

## Design Principles

- Structural permanence over runtime dependency
- Clear separation of inference and execution
- Engine-agnostic world specification
- Modular backend compatibility
- Extensible metaclass ontology

---

## Strategic Positioning

AMAR Engine is both:

- A world execution engine
- A persistent world standard

It defines a protocol for constructing computable universes.