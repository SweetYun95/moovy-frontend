import { useState } from 'react';
import { Toggle } from './Toggle';

export function ToggleDemo() {
  const [toggleChecked, setToggleChecked] = useState(false);

  // 기본 토글 설정
  const basicToggles = [
    {
      label: '알림 설정',
      checked: toggleChecked,
      onChange: setToggleChecked,
    },
    {
      label: '자동 재생',
      checked: true,
    },
  ];

  // 상태별 토글 설정
  const stateToggles = [
    {
      label: '비활성화 (OFF)',
      disabled: true,
    },
    {
      label: '비활성화 (ON)',
      checked: true,
      disabled: true,
    },
  ];

  return (
    <div className="component-demo">
      <h4>Toggle Components</h4>
      <div className="row">
        <div className="col-md-6">
          <h5>Basic Toggle</h5>
          {basicToggles.map((toggle, index) => (
            <div key={index} className="mb-3">
              <label className="d-block mb-2">{toggle.label}</label>
              <Toggle
                checked={toggle.checked}
                onChange={toggle.onChange}
                disabled={toggle.disabled}
              />
            </div>
          ))}
        </div>
        <div className="col-md-6">
          <h5>Toggle States</h5>
          {stateToggles.map((toggle, index) => (
            <div key={index} className="mb-3">
              <label className="d-block mb-2">{toggle.label}</label>
              <Toggle
                checked={toggle.checked}
                disabled={toggle.disabled}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
