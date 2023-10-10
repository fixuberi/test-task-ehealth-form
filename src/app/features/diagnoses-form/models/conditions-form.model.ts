import { DiagnoseICPC } from './diagnose-icpc.model'

export interface ConditionsForm {
  date: Date,
  conditions: Array<{
    diagnose: DiagnoseICPC,
    note: string,
  }>
}

export type DiagnoseWithNote = ConditionsForm['conditions'][number]
