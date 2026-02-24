AMAR Engine has two ways of real-world capture
Users input photos or videos, and we generate a 3D world (similar to a level in Unreal Engine), which is a complete, interactive world, not just a simple 3D model
So each AEID corresponds to a very complex system

The first way is for Gemini to tell AMAR Engine (AME for short) about the world's structure and the placement of objects;







The second way is our long-term development goal:

Let's elaborate on the input part. When users upload media to AME, AME will recognize it (so we might need some professional models, one specifically for spatial perception, one for object recognition, one for expression, so we might integrate LLM, or transfer part of the work to the cloud. The proportion of cloud usage will definitely increase in the future because the complexity of our tasks will increase)








Current task: Let's first create a minimalist UI application and release a GitHub release:

AME Minimalist UI Application (MVP) Development Plan
Our goal is to first create a "foundation version" that implements the "upload -> recognition -> structured description" link.

1. Core Function Modules (Current Task)
Media Uploader: Supports users dragging in photos or short videos.

Cloud Perception Bridge:

Stream media data to the cloud.

Integrate Gemini (or other VLM) for primary spatial perception: Identify which objects (Table, Cup, Chair) are in the scene and their approximate relative positions.

System Generator:

Receive structured data returned from the cloud.

Automatically assign Metaclass to recognized objects according to Skills specification (for example: recognize "cup", automatically mark it as Metaclass: Container).

AEID Registry: Generate a unique AEID locally and save the configuration of this miniature "system" locally.

2. Minimalist UI Interface Design
Style: Minimalism, similar to compilers or pure productivity tools.

Layout:

Left side: Media preview window (displaying photos/videos uploaded by users).

Right side: Real-time generated scene structure tree (Scene Graph), showing AEID, object list and corresponding metaclass properties.

Bottom: Status bar, showing the logical progress of cloud model perception.