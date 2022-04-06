const actualModule = jest.requireActual('react-icons/ri');

module.exports = {
  _esModule: true,
  ...actualModule,
  // too many or unknown props to mock
  // eslint-disable-next-line react/jsx-props-no-spreading
  RiAccountCircleFill: jest.fn((props) => <div {...props}>RiAccountCircleFill</div>),
  // too many or unknown props to mock
  // eslint-disable-next-line react/jsx-props-no-spreading
  RiArrowLeftLine: jest.fn((props) => <div {...props}>RiArrowLeftLine</div>),
  // too many or unknown props to mock
  // eslint-disable-next-line react/jsx-props-no-spreading
  RiArrowLeftRightFill: jest.fn((props) => <div {...props}>RiArrowLeftRightFill</div>),
  // too many or unknown props to mock
  // eslint-disable-next-line react/jsx-props-no-spreading
  RiCheckLine: jest.fn((props) => <div {...props}>RiCheckLine</div>),
  // too many or unknown props to mock
  // eslint-disable-next-line react/jsx-props-no-spreading
  RiCheckboxCircleFill: jest.fn((props) => <div {...props}>RiCheckboxCircleFill</div>),
  // too many or unknown props to mock
  // eslint-disable-next-line react/jsx-props-no-spreading
  RiCloseLine: jest.fn((props) => <div {...props}>RiCloseLine</div>),
  // too many or unknown props to mock
  // eslint-disable-next-line react/jsx-props-no-spreading
  RiMenuFill: jest.fn((props) => <div {...props}>RiMenuFill</div>),
  // too many or unknown props to mock
  // eslint-disable-next-line react/jsx-props-no-spreading
  RiQuestionFill: jest.fn((props) => <div {...props}>RiQuestionFill</div>),
  // too many or unknown props to mock
  // eslint-disable-next-line react/jsx-props-no-spreading
  RiSearchLine: jest.fn((props) => <div {...props}>RiSearchLine</div>),
  // too many or unknown props to mock
  // eslint-disable-next-line react/jsx-props-no-spreading
  RiThumbDownFill: jest.fn((props) => <div {...props}>RiThumbDownFill</div>),
  // too many or unknown props to mock
  // eslint-disable-next-line react/jsx-props-no-spreading
  RiThumbUpFill: jest.fn((props) => <div {...props}>RiThumbUpFill</div>),
  // too many or unknown props to mock
  // eslint-disable-next-line react/jsx-props-no-spreading
  RiUser3Fill: jest.fn((props) => <div {...props}>RiUser3Fill</div>),
};

export {};
