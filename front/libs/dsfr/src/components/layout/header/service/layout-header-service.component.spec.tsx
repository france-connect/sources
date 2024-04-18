// @see _doc/jest.md
import { render } from '@testing-library/react';

import type { HeaderService } from '../../../../interfaces';
import { LayoutHeaderServiceComponent } from './layout-header-service.component';

describe('LayoutHeaderServiceComponent', () => {
  const headerServiceMock: HeaderService = {
    name: 'any service name mock',
    title: 'title service mock',
  };

  it('should match the snapshot', () => {
    // when
    const { container } = render(<LayoutHeaderServiceComponent service={headerServiceMock} />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot when baseline is defined', () => {
    // given
    const headerServiceMockWithBaseline = {
      ...headerServiceMock,
      baseline: 'any baseline mock',
    };

    // when
    const { container } = render(
      <LayoutHeaderServiceComponent service={headerServiceMockWithBaseline} />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot when href is defined', () => {
    // given
    const headerServiceMockWithHref = {
      ...headerServiceMock,
      href: '/any-href-mock',
    };

    // when
    const { container } = render(
      <LayoutHeaderServiceComponent service={headerServiceMockWithHref} />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot when baseline and href are defined', () => {
    // given
    const headerServiceMockWithBaselineAndHref = {
      ...headerServiceMock,
      baseline: 'any baseline mock',
      href: '/any-href-mock',
    };

    // when
    const { container } = render(
      <LayoutHeaderServiceComponent service={headerServiceMockWithBaselineAndHref} />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should service name be in the document with a title', () => {
    // when
    const { getByText, getByTitle } = render(
      <LayoutHeaderServiceComponent service={headerServiceMock} />,
    );
    const elementName = getByText('any service name mock');
    const elementTitle = getByTitle('title service mock');

    // then
    expect(elementName).toBeInTheDocument();
    expect(elementTitle).toBeInTheDocument();
  });

  it('should service name be in the document with a title and when href is not defined', () => {
    // when
    const { getByText, getByTitle } = render(
      <LayoutHeaderServiceComponent service={headerServiceMock} />,
    );
    const elementName = getByText('any service name mock');
    const elementTitle = getByTitle('title service mock');

    // then
    expect(elementName).toBeInTheDocument();
    expect(elementTitle).toBeInTheDocument();
    expect(elementTitle.getAttribute('href')).toBe('/');
  });

  it('should service name be in the document with a title and when href is defined', () => {
    // given
    const headerServiceMockWithHref = {
      ...headerServiceMock,
      href: '/any-href-mock',
    };

    // when
    const { getByText, getByTitle } = render(
      <LayoutHeaderServiceComponent service={headerServiceMockWithHref} />,
    );
    const elementName = getByText('any service name mock');
    const elementTitle = getByTitle('title service mock');

    // then
    expect(elementName).toBeInTheDocument();
    expect(elementTitle).toBeInTheDocument();
    expect(elementTitle.getAttribute('href')).toBe('/any-href-mock');
  });

  it('should service baseline be in the document', () => {
    // given
    const headerServiceMockWithBaseline = {
      ...headerServiceMock,
      baseline: 'acme service baseline mock',
    };

    // when
    const { getByText } = render(
      <LayoutHeaderServiceComponent service={headerServiceMockWithBaseline} />,
    );
    const element = getByText('acme service baseline mock');

    // then
    expect(element).toBeInTheDocument();
  });
});
