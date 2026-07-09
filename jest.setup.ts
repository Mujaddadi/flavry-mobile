// React 19 + test-renderer requires this flag so state updates
// are committed synchronously inside act() during tests.
// @ts-expect-error – global not typed in RN test env
global.IS_REACT_ACT_ENVIRONMENT = true;
