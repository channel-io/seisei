#!/usr/bin/env node

import { generate } from './generate'
import { init } from './init'

const argv = process.argv.slice(2)

const execute = argv.includes('init') ? init : generate

execute()
