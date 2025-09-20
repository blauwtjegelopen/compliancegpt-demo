#!/usr/bin/env bash
set -e
npm update next
npm audit fix --force || true
