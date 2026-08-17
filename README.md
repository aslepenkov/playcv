Build a Living 3D CV — Interactive Retro 3D Globe
Role
You are a senior frontend/game-engine engineer. Build a complete, runnable MVP of an interactive personal CV presented as a small explorable 3D world.

Do not build a conventional portfolio website with a 3D background. The 3D world itself is the primary interface.

The project must be cleanly architected, modular, data-driven, and easy to extend with new locations and personal information without changing application code.

1. Core Concept
Create a small spherical world / mini globe inspired by early-2000s 3D games.

The player controls a third-person low-poly character and can physically walk around the surface of a small spherical planet.

The world represents the user's life as a living CV.

Examples of locations:

hometown
home
school
university
workplaces
professional projects
hobbies
other meaningful places or events
Instead of navigating a traditional CV using menus, the user explores the world and discovers the information by physically visiting locations.

The experience should feel like an early-2000s 3D game / interactive diorama, not like a modern corporate portfolio.

2. Visual Style
Use a nostalgic early-2000s 3D aesthetic.

Target visual references:

early PC / console 3D games
low-poly geometry
relatively low-resolution textures
simple materials
simple dynamic lighting
slightly exaggerated geometry
stylized environment
retro game atmosphere
Do NOT make it look like modern photorealistic 3D.

Do NOT specifically emulate PS1 or Sega Saturn rendering artifacts.

The target is closer to the visual language of early-2000s 3D games.

The character may initially be a placeholder low-poly human model. The architecture must allow replacing it later without changing gameplay code.

3. World Geometry
The world is a true spherical planet.

The player walks on the surface of the sphere.

The character must remain correctly oriented relative to the local surface normal.

Movement must follow the curvature of the planet.

The camera must remain stable and readable while the character travels around the spherical surface.

The world size must NOT be hardcoded.

The city/environment must be dynamically generated from the supplied JSON data.

The number of streets, buildings and POIs should be able to grow as more JSON data is added.

4. Data-Driven World
Create a JSON-based world description.

The JSON is the source of truth for the content and visual representation of the world.

A POI may define things such as:

{ 
  "id": "university", 
  "type": "education", 
  "title": "University", 
  "description": "...", 
  "period": "...", 
  "coordinates": { 
    "latitude": 51.1, 
    "longitude": 71.4 
  }, 
  "visual": { 
    "building": "university", 
    "scale": 1.2, 
    "color": "...", 
    "sign": "University" 
  }, 
  "content": { 
    "skills": [], 
    "projects": [], 
    "links": [], 
    "images": [] 
  } 
} 
Do not assume this exact schema is final. Design a sensible extensible schema.

The architecture must allow:

adding POIs without modifying TypeScript/JavaScript
changing POI positions
changing buildings
changing visual properties
changing signs
adding arbitrary content
adding new POI types
adding new personal experiences later
5. Procedural / Dynamic City Generation
Generate the miniature city dynamically from the JSON.

The generator should create an environment around the POIs.

At minimum, generate:

roads / paths
terrain
buildings
vegetation
street decorations
signs
POI-specific buildings
The system should avoid placing everything as isolated floating objects.

POIs should feel like real places within a small town.

The generator should be deterministic where practical, so the same JSON produces the same world.

Keep the generation system modular:

WorldData 
    ↓ 
WorldGenerator 
    ├── TerrainGenerator 
    ├── RoadGenerator 
    ├── BuildingGenerator 
    ├── VegetationGenerator 
    ├── DecorationGenerator 
    └── POIGenerator 
5A. World Design — Sonic 3 & Knuckles Special Stage Reference
Use the Special Stage from Sonic 3 & Knuckles as an important visual and spatial reference for the overall world concept.

Reference: Sonic 3 & Knuckles — Special Stage

The reference is primarily about the feeling, composition and spatial density of the world, not about directly copying its assets or graphics.

The world should feel like a small, compact spherical playground that can be continuously explored by walking across its curved surface.

Dense Miniature World
The world must be very dense and compact.

Avoid large empty areas between locations.

POIs, buildings, roads, paths, vegetation and decorative objects should be placed close together so that the world feels like a miniature model town rather than a large realistic city.

The intended feeling is:

A tiny, dense, handcrafted world packed onto a small planet.

The player should frequently encounter something interesting while moving.

There should be very little:

empty terrain
large unused fields
excessive spacing between buildings
long stretches of road with nothing around them
visually empty parts of the sphere
Even though the world is procedurally generated, it should feel intentionally designed and densely populated.

Roads and Paths as the Foundation
The primary structure of the world should be created from roads, streets, paths and walkable routes.

Buildings and POIs should be positioned around the road/path network, rather than simply being scattered independently across the terrain.

The generation hierarchy should conceptually be:

Spherical Terrain 
       ↓ 
Roads / Streets / Paths 
       ↓ 
Buildings / Blocks 
       ↓ 
POIs 
       ↓ 
Vegetation / Props / Signs / Decorations 
The road and path network should define how the player naturally explores the world.

Paths should connect important POIs and create loops, intersections and alternative routes where practical.

Avoid generating isolated buildings that are not connected to the walkable network.

Miniature Scale
The entire environment should use an intentionally miniaturized scale.

Buildings, streets, vegetation, props and POIs should be compact and visually close together.

The player should feel like they are exploring a small physical diorama / miniature planet, not walking through a full-scale real city.

Prioritize:

short distances between POIs
narrow compact streets
small buildings
dense clusters of objects
frequent visual landmarks
interconnected paths
compact neighborhoods
The scale should support exploration of the entire world without requiring long periods of walking.

Spatial Density
Introduce a configurable world-density parameter in the procedural generation system.

For example:

worldConfig = { 
  density: 0.85, 
  minimumPOIDistance: 4, 
  roadDensity: 0.9, 
  decorationDensity: 0.8 
} 
These values are illustrative; choose appropriate values for the actual world scale.

The important requirement is that density is a first-class generation parameter, not an accidental result of object placement.

The generator should prioritize fitting meaningful content into a small spherical area.

Exploration Feel
The player should almost always have something visible nearby:

a building
a road intersection
a sign
vegetation
a POI
a landmark
another path
a decorative object
The player should be able to look around from almost any point and see a recognizable part of the miniature town.

The world should feel alive, packed and intentional, despite being procedurally generated.

Important Constraint
Do NOT interpret procedural generation as:

"Generate a large terrain and randomly scatter buildings and POIs across it."

Instead, implement:

"Generate a compact spherical miniature town whose roads and paths organize a dense network of buildings, POIs and environmental details."

The Special Stage-inspired spherical composition + dense miniature town + road/path-based structure should be one of the defining characteristics of the project.

6. Third-Person Character
Implement a third-person playable character.

The character:

walks around the spherical world
follows the local surface orientation
smoothly rotates toward the movement direction
has basic idle/walk animation or procedural movement
remains replaceable through a single model/configuration change
Do not over-engineer character mechanics.

This is an exploration experience, not an action game.

7. Controls
Keep controls deliberately simple.

Desktop
Arrow keys = movement
Enter = interact
The camera should automatically follow the character.

Do not require complex camera controls.

Mobile
Swipe gestures = movement
Tap = interaction
The experience must be usable on a phone without a physical keyboard.

Make touch targets and interaction feedback obvious.

8. POI Interaction
When the player approaches an interesting location, display an interaction hint.

Example:

ENTER / TAP TO EXPLORE 
When the user interacts:

pause or de-emphasize gameplay
open a clean UI information panel
display the POI's content
allow the user to close the panel and continue exploring
The UI should feel like part of the game rather than a conventional corporate CV.

The POI information structure must be arbitrary/extensible.

A POI can contain:

title
description
dates
projects
technologies
skills
achievements
links
images
arbitrary custom fields
Do not hardcode separate UI implementations for school, university, work, hobbies, etc.

Use a generic POI content renderer.

9. Living CV Concept
The project should communicate a personal history through geography.

For example:

Hometown 
   ↓ 
School 
   ↓ 
University 
   ↓ 
First Job 
   ↓ 
Professional Projects 
   ↓ 
Current Work 
   ↓ 
Hobbies 
These should feel like actual locations in the world rather than entries in a resume.

The goal is:

"Explore my life instead of reading my CV."

The world should therefore encourage exploration.

10. Day / Night Cycle
Implement a smooth accelerated day/night cycle.

Exactly:

1 real minute = 1 complete in-game day.

The cycle should continuously and smoothly change:

sun position
sky lighting
ambient lighting
shadows
environment brightness
color temperature where appropriate
street/building lights at night
Avoid a simple Day/Night toggle.

The transition must be continuous.

11. Four Seasons
Implement four seasons:

Spring 
Summer 
Autumn 
Winter 
Each season lasts exactly 5 real minutes.

Therefore:

Spring   0–5 min 
Summer   5–10 min 
Autumn   10–15 min 
Winter   15–20 min 
Then the cycle repeats.

The transition between seasons must be smooth, not an instantaneous asset swap.

The environment should gradually change:

Spring
fresh vegetation
greener terrain
mild atmosphere
Summer
full vegetation
lush environment
brighter appearance
Autumn
changing foliage
warmer/darker environment
fallen leaves where appropriate
Winter
snow
reduced vegetation
winter atmosphere
The seasonal system must be implemented as a reusable environment system rather than hardcoded visual effects.

12. Combined Time System
Day/night and seasons are independent cycles.

Therefore:

day/night repeats every 1 minute
seasons repeat every 20 minutes
Both systems run simultaneously.

Example:

00:00 — Spring + Sunrise 
00:30 — Spring + Sunset 
01:00 — Spring + next sunrise 
05:00 — Summer 
10:00 — Autumn 
15:00 — Winter 
20:00 — Spring again 
13. Performance
This must run in a browser.

Prioritize performance on:

desktop
modern Android phones
modern iPhones
Avoid unnecessarily expensive:

high-poly models
huge textures
excessive dynamic lights
unnecessary post-processing
thousands of unique draw calls
Use instancing, batching, LOD or simplified geometry where appropriate.

The retro visual style should also help performance.

14. Responsive UI
The 3D world should occupy the majority of the viewport.

UI should include only what is necessary:

subtle interaction hint
POI information panel
close/back control
optional small time/season indicator
The UI must work on both desktop and mobile.

Avoid turning the project into a dashboard.

15. Suggested Technology
Use a modern TypeScript web stack.

Preferred:

TypeScript
Vite
Three.js
React where useful for UI
React Three Fiber only if it provides a clear architectural benefit
Do not add libraries unnecessarily.

Prefer simple, understandable architecture over framework complexity.

16. Architecture
Keep responsibilities separated.

Suggested structure:

src/ 
  world/ 
    World.ts 
    WorldGenerator.ts 
    TerrainGenerator.ts 
    RoadGenerator.ts 
    BuildingGenerator.ts 
    VegetationGenerator.ts 
    POIGenerator.ts 
 
  character/ 
    Character.ts 
    CharacterController.ts 
 
  camera/ 
    ThirdPersonCamera.ts 
 
  interaction/ 
    InteractionSystem.ts 
    POIInteraction.ts 
 
  time/ 
    DayNightCycle.ts 
    SeasonCycle.ts 
    WorldTime.ts 
 
  data/ 
    world.json 
    types.ts 
    loader.ts 
 
  ui/ 
    POIPanel.tsx 
    InteractionHint.tsx 
    TimeIndicator.tsx 
 
  assets/ 
    ... 
 
  main.tsx 
You may change this structure if a better architecture is justified.

17. MVP Requirements
The first implementation must be a fully runnable MVP, not a collection of placeholders.

It must demonstrate:

spherical world
dynamically generated miniature city
at least several different POIs
playable third-person character
curved-surface movement
automatic third-person camera
desktop controls
mobile touch controls
interaction system
working POI information panel
JSON-driven world
dynamic building generation
day/night cycle
four-season cycle
smooth transitions
early-2000s visual style
Include enough sample POIs to demonstrate that the concept works.

Use fictional/sample personal data where real data is not available.

18. Developer Experience
The project must run with the standard commands:

npm install 
npm run dev 
Also provide:

npm run build 
The production build must complete without errors.

Avoid requiring a backend for the MVP.

The world should load from a local JSON file.

19. Important Implementation Principle
Do not optimize for producing a quick visual demo.

Build the foundation of a reusable system.

The most important architectural requirement is:

Adding a new location should require editing JSON, not modifying the game engine.

For example, after the implementation is complete, I should be able to add:

"My First Startup" 
"My Favorite Project" 
"My Favorite Game" 
"My Hobby" 
"My Current Office" 
by adding JSON entries and assets, without rewriting the world-generation or interaction logic.

20. Acceptance Criteria
Consider the MVP complete only when all of the following are true:

The application starts successfully.
The player can walk around a spherical world.
The character correctly follows the curvature of the planet.
The city is generated dynamically from JSON.
POIs are generated from JSON.
POIs have visual representations.
The player can approach a POI.
An interaction hint appears.
Enter activates the POI on desktop.
Tap activates the POI on mobile.
POI content is rendered dynamically.
The information panel is responsive.
The day/night cycle completes every real-time minute.
The day/night transition is smooth.
Spring/Summer/Autumn/Winter each last five real minutes.
Seasonal transitions are smooth.
The complete seasonal cycle takes 20 minutes.
Desktop controls work.
Mobile controls work.
The visual style is consistently early-2000s 3D.
The character is replaceable.
New POIs can be added through JSON.
npm run build succeeds.
21. Implementation Workflow
Before coding:

Inspect the repository.
Identify the existing stack and constraints.
Decide whether React Three Fiber or vanilla Three.js is more appropriate.
Define the JSON schema.
Define the world-generation architecture.
Define the coordinate system for the spherical world.
Define the time/season model.
Then implement the MVP incrementally.

After implementation:

Run the application.
Run the production build.
Fix runtime errors.
Fix TypeScript errors.
Test desktop controls.
Test mobile interaction logic.
Verify the spherical movement.
Verify the day/night timing.
Verify the 20-minute seasonal cycle.
Verify that adding a POI through JSON works without code changes.
Do not stop after creating the initial scaffolding. Deliver the working MVP

.

deploy: deploy via github actions and netlify so prep yaml for ci cd flow:

everything from branch main builds in gh actions and deploys to netlify
