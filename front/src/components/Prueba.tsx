import { useState } from "react";
const Prueba = () => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(prev => !prev);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <p>{isToggled ? '¡Texto activado!' : '¡Texto desactivado!'}</p>
      <button 
        onClick={handleToggle} 
        style={{ padding: '10px 20px', fontSize: '16px' }}
      >
        {isToggled ? 'Desactivar' : 'Activar'}
      </button>
    </div>
  );
};

export default Prueba;
