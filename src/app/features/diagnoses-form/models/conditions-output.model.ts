export type ConditionContext = {
  identifier: {
    type: {
      coding: [
        {
          system: 'eHealth/resources';
          code: 'encounter';
        }
      ];
    };
    value: string;
  };
};

export type ConditionCode = {
  coding: [
    {
      system: 'eHealth/ICPC2/condition_codes';
      code: string;
    }
  ];
};

export type ConditionNotes = string | null;

export type Condition = {
  id: string;
  context: ConditionContext;
  code: ConditionCode;
  notes: ConditionNotes;
  onset_date: string;
};

export interface ConditionsOutput {
  encounter: {
    date: string;
  };
  conditions?: Array<Condition>;
}
