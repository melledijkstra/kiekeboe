import { createMessage } from '@/messaging'
import type { TimerState, ChronometerState, AlarmState } from './types'

export const startTimer = createMessage<number, void>('timeToolsStartTimer')
export const stopTimer = createMessage<void, void>('timeToolsStopTimer')
export const getTimerState = createMessage<void, TimerState>('timeToolsGetTimerState')
export const timerStateUpdate = createMessage<TimerState, void>('timeToolsTimerStateUpdate')

export const startChronometer = createMessage<void, void>('timeToolsStartChronometer')
export const stopChronometer = createMessage<void, void>('timeToolsStopChronometer')
export const getChronometerState = createMessage<void, ChronometerState>('timeToolsGetChronometerState')
export const chronometerStateUpdate = createMessage<ChronometerState, void>('timeToolsChronometerStateUpdate')

export const setAlarm = createMessage<number, void>('timeToolsSetAlarm')
export const clearAlarm = createMessage<void, void>('timeToolsClearAlarm')
export const getAlarmState = createMessage<void, AlarmState>('timeToolsGetAlarmState')
export const alarmTriggered = createMessage<void, void>('timeToolsAlarmTriggered')
export const alarmStateUpdate = createMessage<AlarmState, void>('timeToolsAlarmStateUpdate')
