module.exports = class Validator {
  constructor(rules) {
    this.rules = rules;
    this.rulesTypes = ['string', 'number'];
  }

  validate(obj) {
    const errors = [];
    if (!obj) {
      errors.push({field: 'obj', error: 'expect obj, got undefined'});
      return errors;
    }
    for (const field of Object.keys(this.rules)) {
      const rules = this.rules[field];
      const validType = this.rulesTypes.includes(rules.type);
      if (!validType) {
        errors.push(
            {field: 'type in constructor', error: `expect ${this.rulesTypes}, got ${rules.type}`});
        break;
      }
      const validMinInteger = rules.min % 1 === 0;
      const validMaxInteger = rules.max % 1 === 0;
      if (!validMinInteger) {
        errors.push({field: 'min in constructor', error: `expect integer, got ${rules.min}`});
        break;
      }
      if (!validMaxInteger) {
        errors.push({field: 'max in constructor', error: `expect integer, got ${rules.max}`});
        break;
      }
      const validRange = rules.min <= rules.max;
      if (!validRange) {
        errors.push(
            {
              field: 'min in constructor',
              error: `expect less or equal than ${rules.max}, got ${rules.min}`,
            });
        break;
      }
      const value = obj[field];
      const type = typeof value;

      if (type !== rules.type) {
        errors.push({field, error: `expect ${rules.type}, got ${type}`});
        return errors;
      }

      switch (type) {
        case 'string':
          if (value.length < rules.min) {
            errors.push({field, error: `too short, expect ${rules.min}, got ${value.length}`});
          }
          if (value.length > rules.max) {
            errors.push({field, error: `too long, expect ${rules.max}, got ${value.length}`});
          }
          break;
        case 'number':
          if (isNaN(value)) {
            errors.push({field, error: `expect integer, got ${value}`});
          }
          if (value < rules.min) {
            errors.push({field, error: `too little, expect ${rules.min}, got ${value}`});
          }
          if (value > rules.max) {
            errors.push({field, error: `too big, expect ${rules.min}, got ${value}`});
          }
          break;
      }
    }

    return errors;
  }
};
