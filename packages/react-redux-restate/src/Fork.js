import reprovide from './reprovide';
import restate from './restate';

const RenderChildren = ({ children }) => children;

const Fork = reprovide('global');

const Unfork = restate({ global: 'global' }, ({ global }) => global, ({ global }, event) => global(event))(
  RenderChildren,
);

export { Fork, Unfork };
