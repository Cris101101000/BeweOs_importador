import type { EmbedScriptConfig } from "src/lindaConfig/domain/share/types";

const DEFAULT_POSITION = "bottom-right";

/**
 * Genera el script de integración del chatbot para incrustar en sitios web externos.
 */
export const generateEmbedScript = (config: EmbedScriptConfig): string => {
	const {
		apiKey,
		position = DEFAULT_POSITION,
		sdkUrl = process.env.REACT_APP_CHATBOT_SDK_URL,
	} = config;

	return `<script>
    (function () {
      // 1. Crear el script que carga el SDK
      var s = document.createElement('script');
      s.src = '${sdkUrl}';
      s.async = true;

      // 2. Cuando el SDK haya cargado, inicializarlo
      s.onload = function () {
        if (window.chatSdk && typeof window.chatSdk.init === 'function') {
          window.chatSdk.init({
            apiKey: '${apiKey}',
            position: '${position}',
          });
        } else {
          console.error('chatSdk no está disponible en window');
        }
      };

      // 3. Insertar el script en la página
      var firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode.insertBefore(s, firstScript);
    })();
  </script>`;
};
