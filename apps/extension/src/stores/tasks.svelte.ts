import type { Task } from '@/api/definitions/google'
import { writable } from 'svelte/store'

export const tasks = writable<Array<Task>>([])
