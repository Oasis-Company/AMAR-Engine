# AMAR Engine Documentation Index

Welcome to the AMAR Engine (AME) system documentation. This documentation index provides navigation to all related documents.

## Document Directory

### 1. System Overview

- **[System Overview](overview_en.md)** - Introduces the basic concepts, components, and vision of the AME system
- **[System Architecture](architecture_en.md)** - Detailed introduction to the three-path recursive architecture of the AME system and the relationships between components

### 2. Core Concepts

- **[Core Concepts](core_concepts_en.md)** - Detailed introduction to the core concepts in the AME system, including the Metaclass system, AEID system, Skills system, etc.

### 3. Technical Reference

- **[API Reference](api_reference_en.md)** - Detailed introduction to the API interfaces of the AME system, including RESTful API, internal component interfaces, etc.
- **[Developer Guide](developer_guide_en.md)** - Detailed development guide for the development team, including system architecture, component descriptions, development process, etc.
- **[Design System](design_system.md)** - Detailed introduction to the design system of the AME system, including color system, typography, component library, etc.

### 4. Quick Start

- **[Information](info_en.md)** - Basic system information and development plan

## 5. System Components

The AME system consists of the following core components:

### 5.1 AME Scanner

- **Function**: Spatial skeleton capture
- **Core Technologies**: Density collapse processing, OBB fitting
- **Output**: Provides geometric constraints for entities

### 5.2 AMAR ENGINE

- **Function**: System core, including Normalization Center (Admin)
- **Core Technologies**: Metaclass system, AEID system, Skills system
- **Output**: Collapses data from three paths into a unique physical entity

### 5.3 AMAR GENIS

- **Function**: Physics engine, executor of physical laws
- **Core Technologies**: Multiple physics solvers, rendering system, sensor system
- **Output**: Implements physical instantiation and behavior simulation of entities

### 5.4 Metaclass System

- **Function**: Defines physical properties and behavior rules for entities
- **Core Technologies**: Root metaclass, standard metaclass, metaclass inheritance
- **Output**: Provides self-consistent behavior rules for entities

## 6. Development Status

- **[AME Scanner]** Prototype v0.1 closed loop, implemented high-performance point cloud density filtering based on C++
- **[AMAR ENGINE]** Defining SAP-01 normalization protocol
- **[AMAR GENIS]** Core layer rewriting scheme under discussion
- **[Metaclass System]** Multi-language prototype implementation completed

## 7. System Vision

The AME system aims to create a digital ecosystem that can truly reflect and simulate the real world, where each entity has physical properties and behaviors highly consistent with the real world. In this way, AME is not just a technical tool, but a redefinition of digital reality.

## 8. System Manifesto

> "Reality is just a suggestion; AMAR GENIS is the law."

> "Direction defines miracles."

## 9. Contact Us

If you have any questions or suggestions, please contact the AMAR Engine development team.

---

© 2026 AMAR Engine Development Team