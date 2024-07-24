export const UserPreferencesTutorialComponent = jest.fn(
  ({ alt, img, label }: { label: string; img: string; alt: string }) => (
    <div>
      <span>UserPreferencesTutorialComponent :</span>
      <div>{label}</div>
      <div>{img}</div>
      <div>{alt}</div>
    </div>
  ),
);
