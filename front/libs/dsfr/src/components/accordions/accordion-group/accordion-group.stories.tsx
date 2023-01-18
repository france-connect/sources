import { ComponentMeta, ComponentStory } from '@storybook/react';

import { AccordionGroupComponent } from './accordion-group.component';

export default {
  component: AccordionGroupComponent,
  title: 'DSFR/components/accordions/accordion-group/AccordionGroupComponent',
} as ComponentMeta<typeof AccordionGroupComponent>;

const items = [
  {
    element: (
      <div>
        <h2>Title 1</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam rutrum odio quis sem
          lobortis lacinia. Donec sed sapien et ligula luctus condimentum in ut felis. Pellentesque
          id nulla hendrerit, pharetra massa in, aliquet urna. Nam eget elit eget arcu tincidunt
          efficitur. Nulla volutpat massa a metus molestie, vitae egestas risus pulvinar. Proin
          lorem justo, feugiat non ultrices non, hendrerit quis elit. Quisque porta imperdiet justo,
          hendrerit fringilla neque fringilla nec. Integer auctor dui orci, id fringilla libero
          consectetur id. In mattis tortor ut magna gravida, quis scelerisque magna fermentum. Etiam
          sollicitudin ornare faucibus. Curabitur eu neque blandit, auctor augue ut, rhoncus lorem.
          Nam congue nibh sed vestibulum interdum.
        </p>
      </div>
    ),
    id: '123',
    title: 'First accordion',
  },
  {
    element: (
      <div>
        <h2>Title 2</h2>
        <p>
          Mauris mollis eros a quam consequat aliquam. Nullam bibendum ex quis risus tincidunt,
          commodo rutrum mi sagittis. Fusce eleifend luctus nisl, quis suscipit erat sagittis eget.
          Etiam pharetra dui molestie, convallis lectus in, condimentum est. Integer consequat
          interdum volutpat. Phasellus nec vestibulum metus. Phasellus at orci felis. Praesent ac
          lorem interdum, porta odio sed, luctus urna. Nulla egestas eleifend cursus. Nullam
          porttitor iaculis nulla non lacinia. Ut ultricies nec dui eu sodales. Morbi quis accumsan
          justo, ut imperdiet magna. Aenean id egestas sapien, tristique pretium odio.
        </p>
      </div>
    ),
    id: '456',
    title: 'Second accordion',
  },
  {
    element: (
      <div>
        <h2>Title 2</h2>
        <p>
          Donec lacinia vitae turpis aliquet tincidunt. Quisque ornare quam eu urna tincidunt, at
          suscipit enim cursus. Proin quis fermentum arcu. Vivamus justo mi, auctor at commodo eu,
          finibus nec urna. Donec et est vitae odio imperdiet finibus sed nec metus. Etiam cursus in
          nisl sit amet placerat. Donec mattis imperdiet sapien, ac ultricies orci condimentum nec.
          Aliquam erat volutpat. Praesent ut vehicula enim. Sed iaculis, sem in laoreet convallis,
          dui quam ultricies elit, sed ullamcorper mauris ligula eu sapien. Suspendisse ac turpis
          sit amet arcu facilisis sodales vitae eget tortor. Curabitur venenatis neque eget pretium
          ultrices.
        </p>
      </div>
    ),
    id: '789',
    title: 'Third accordion',
  },
];

const Template: ComponentStory<typeof AccordionGroupComponent> = (args) => (
  <AccordionGroupComponent {...args} />
);

export const Default = Template.bind({});
Default.args = {
  items,
};

export const WithDefaultValues = Template.bind({});
WithDefaultValues.args = {
  items,
  options: {
    defaultValues: ['789'],
  },
};

export const WithMultiple = Template.bind({});
WithMultiple.args = {
  items,
  options: {
    defaultValues: ['123', '789'],
    multiple: true,
  },
};
