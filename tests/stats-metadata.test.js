const { metadata } = require("../src/metadata");

test("should return some metadata when generating metadata given valid selections", () => {
  const output = metadata(new Date(), createSelections());

  expect(output.metadata).not.toBeFalsy();
});

test("should throw error when generating metadata given missing start date", () => {
  expect(() => metadata(new Date(), createSelections({ selectedStartDate: undefined }))).toThrow();
});

test("should throw error when generating metadata given missing end date", () => {
  expect(() => metadata(new Date(), createSelections({ selectedEndDate: undefined }))).toThrow();
});

test("should throw error when generating metadata given missing account", () => {
  expect(() => metadata(new Date(), createSelections({ selectedAccount: undefined }))).toThrow();
});

test("should throw error when generating metadata given missing property", () => {
  expect(() => metadata(new Date(), createSelections({ selectedProperty: undefined }))).toThrow();
});

test("should throw error when generating metadata given missing profile", () => {
  expect(() => metadata(new Date(), createSelections({ selectedProfile: undefined }))).toThrow();
});

const createSelections = (opts = {}) => ({
  selectedStartDate: getProp(opts, 'selectedStartDate', new Date("2000-01-01")),
  selectedEndDate: getProp(opts, 'selectedEndDate', new Date("2099-01-01")),
  selectedAccount: getProp(opts, 'selectedAccount', {}),
  selectedProperty: getProp(opts, 'selectedProperty', {}),
  selectedProfile: getProp(opts, 'selectedProfile', {}),
});

const getProp = (obj, prop, def) => (prop in obj ? obj[prop] : def);
