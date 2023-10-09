type Condition = {
  id: string;
  context: {
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
  code: {
    coding: [
      {
        system: 'eHealth/ICPC2/condition_codes';
        code: string;
      }
    ];
  };
  notes: string;
  onset_date: string;
};

export interface DiagnosesFormResult {
  encounter: {
    date: string;
  };
  conditions?: Array<Condition>;
}
