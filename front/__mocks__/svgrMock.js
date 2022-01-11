import * as React from 'react';

export default 'SvgrURL';

const SvgrMock = React.forwardRef((props, ref) => <svg ref={ref} {...props} />);
export const ReactComponent = SvgrMock;
