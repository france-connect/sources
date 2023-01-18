import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { useState } from 'react';

import { AccordionComponent } from './accordion.component';

export default {
  component: AccordionComponent,
  title: 'DSFR/components/accordions/accordion/AccordionComponent',
} as ComponentMeta<typeof AccordionComponent>;

const Template: ComponentStory<typeof AccordionComponent> = (args) => {
  const [opened, setOpened] = useState(false);
  return (
    <AccordionComponent {...args} opened={opened} onClick={() => setOpened(!opened)}>
      <h2>Content from children</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing, link test incididunt, ut labore et
        dolore magna aliqua. Vitae sapien pellentesque habitant morbi tristique senectus et. Diam
        maecenas sed enim ut. Accumsan lacus vel facilisis volutpat est. Ut aliquam purus sit amet
        luctus. Lorem ipsum dolor sit amet consectetur adipiscing elit ut.
      </p>
    </AccordionComponent>
  );
};

export const Default = Template.bind({});
Default.args = {
  title: 'Lorem ipsum dolor sit amet',
};

export const OpenedAtStartup = Template.bind({});
OpenedAtStartup.args = {
  opened: true,
  title: 'KO voir ticket #1147',
};

export const WithElementProps = Template.bind({});
WithElementProps.args = {
  element: (
    <React.Fragment>
      <h2>Content from props</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing, link test incididunt, ut labore et
        dolore magna aliqua. Vitae sapien pellentesque habitant morbi tristique senectus et. Diam
        maecenas sed enim ut. Accumsan lacus vel facilisis volutpat est. Ut aliquam purus sit amet
        luctus. Lorem ipsum dolor sit amet consectetur adipiscing elit ut.
      </p>
    </React.Fragment>
  ),
  title: 'Lorem ipsum dolor sit amet',
};
