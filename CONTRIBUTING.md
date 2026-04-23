# Contributing to Infr-Orchestrator

## Goals

Keep contributions portable, readable, and easy to self-host.

## Before opening a change

Make sure the project still:

- works as a static site
- uses relative asset paths
- stays deployable with simple web servers
- remains readable on desktop and mobile

## Preferred change types

- documentation improvements
- visual polish
- responsive layout fixes
- deployment examples
- data-model cleanup
- optional integrations that do not break static mode

## If adding integrations

- keep provider-specific logic out of the main renderer when possible
- normalize external data into one shared dashboard model
- document new dependencies clearly
- provide a fallback path for static-only users

## Validation checklist

- local static serving works
- links and asset paths still resolve
- no hardcoded environment-specific URLs are required
- docs match the actual repo structure
