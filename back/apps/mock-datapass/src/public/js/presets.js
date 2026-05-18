document.addEventListener('DOMContentLoaded', function () {
  var dataEl = document.getElementById('payload-presets-data');
  var payloadPresets = dataEl
    ? JSON.parse(decodeURIComponent(dataEl.getAttribute('data-presets') || '[]'))
    : [];
  var presetSelect = document.getElementById('payload-preset');
  var textarea = document.getElementById('payload');

  if (!presetSelect || !textarea) {
    return;
  }

  presetSelect.addEventListener('change', function () {
    var selectedPreset = payloadPresets.find(function (preset) {
      return preset.id === presetSelect.value;
    });

    if (!selectedPreset) {
      return;
    }

    textarea.value = selectedPreset.payload;
  });
});
