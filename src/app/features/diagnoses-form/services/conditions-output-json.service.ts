import { Injectable } from '@angular/core';

import { generateGUIDFromId } from '@core/utils/guid-generator';

import {
  ConditionsForm,
  DiagnoseWithNote,
} from '../models/conditions-form.model';
import {
  Condition,
  ConditionCode,
  ConditionContext,
  ConditionNotes,
  ConditionsOutput,
} from '../models/conditions-output.model';

@Injectable()
export class ConditionsOutputJsonService {
  constructor() {}

  getConditionsOutput(formValue: ConditionsForm): ConditionsOutput {
    const result: ConditionsOutput = {
      encounter: {
        date: formValue.date.toISOString(),
      },
    };

    if (this.isThereAnyDefinedConditions(formValue.conditions)) {
      result.conditions = formValue.conditions.map((formCondition) =>
        this.buildCondition(formCondition)
      );
    }

    return result;
  }

  private isThereAnyDefinedConditions(
    formConditions: ConditionsForm['conditions']
  ): boolean {
    return (
      formConditions.filter((condition) => !!condition.diagnose).length > 0
    );
  }

  private buildCondition(formCondition: DiagnoseWithNote): Condition {
    return {
      id: this.generateGuid(formCondition.diagnose.id),
      context: this.buildConditionContextObject(formCondition.diagnose),
      code: this.buildConditionCodeObject(formCondition.diagnose),
      notes: this.getNotes(formCondition.note),
      onset_date: new Date().toISOString(),
      /*
        TODO
        onset_date means when the symptoms first appeared or when the condition was diagnosed,
        so UI form probably should be extended with datepicker per diagnose in future
      */
    };
  }

  private buildConditionContextObject(
    diagnose: DiagnoseWithNote['diagnose']
  ): ConditionContext {
    return {
      identifier: {
        type: {
          coding: [
            {
              system: 'eHealth/resources',
              code: 'encounter',
            },
          ],
        },
        value: `${diagnose.id}`,
      },
    };
  }

  private buildConditionCodeObject(
    diagnose: DiagnoseWithNote['diagnose']
  ): ConditionCode {
    return {
      coding: [
        {
          system: 'eHealth/ICPC2/condition_codes',
          code: diagnose.code,
        },
      ],
    };
  }

  private getNotes(note: DiagnoseWithNote['note']): ConditionNotes {
    return note || null;
  }

  private generateGuid(id: number): string {
    return generateGUIDFromId(id);
  }
}
