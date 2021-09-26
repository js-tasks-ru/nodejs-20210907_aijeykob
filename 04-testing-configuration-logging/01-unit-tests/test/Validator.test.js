const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('валидатор проверяет строковые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({name: 'Lalala'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });
    it('test empty validate', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate();

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('obj');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect obj, got undefined');
    });
    it('test wrong rules type ', () => {
      const validator = new Validator({
        name: {
          type: 'string1',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({name: '1234567678'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('type in constructor');
      expect(errors[0]).to.have.property('error')
          .and.to.be.equal('expect string,number, got string1');
    });
    it('test not integer max', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 1,
          max: 1.1,
        },
      });

      const errors = validator.validate({name: 1});
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('max in constructor');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect integer, got 1.1');
    });
    it('test valid min max range', () => {
      const validator = new Validator({
        age: {
          type: 'string',
          min: 10,
          max: 5,
        },
      });

      const errors = validator.validate({age: '12345678910'});
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('min in constructor');
      expect(errors[0]).to.have.property('error')
          .and.to.be.equal('expect less or equal than 5, got 10');
    });
    it('test min persist', () => {
      const validator = new Validator({
        age: {
          type: 'string',
          max: 10,
        },
      });

      const errors = validator.validate({age: '12345678910'});
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('min in constructor');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect integer, got undefined');
    });
    it('test NaN', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 0,
          max: 10,
        },
      });

      const errors = validator.validate({age: NaN});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect integer, got NaN');
    });
    it('test correct data', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 0,
          max: 2,
        },
      });

      const errors = validator.validate({age: -0});
      expect(errors).to.have.length(0);
    });
  });
});
