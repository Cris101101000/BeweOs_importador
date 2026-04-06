import path from "node:path";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';

const MICRO_FRONT_LINDABUSSINESS = process.env.MICRO_FRONT_LINDABUSSINESS || 'http://localhost:3005/remoteEntry.js';

export default defineConfig({
	plugins: [
		pluginReact(),
		pluginModuleFederation({
			name: "beweos-smbs",
			remotes: {
				lindaBusiness: `lindaBusiness@${MICRO_FRONT_LINDABUSSINESS}`,
			},
			shared: {
				react: { 
					singleton: true, 
					requiredVersion: false,
					eager: true,
				},
				'react-dom': { 
					singleton: true, 
					requiredVersion: false,
					eager: true,
				},
				'react-router-dom': {
					singleton: true,
					requiredVersion: false,
					eager: true,
				},
				'@beweco/utils-js': {
					singleton: true,
					requiredVersion: false,
					eager: true,
				},
				'@beweco/aurora-ui': {
					singleton: true,
					requiredVersion: false,
					eager: true,
				}
			},
		}),
	],
	html: {
		title: "BeweOS SMBS"
	},
	server: {
    proxy: {
      '/api': {
        target: process.env.REACT_APP_BASE_URL_BACKEND,
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/api': '' },
        onProxyReq(proxyReq) {
          // Evita que el backend rechace por CORS eliminando la cabecera Origin
          try {
            proxyReq.removeHeader('origin');
          } catch {}
        },
      },
    },
		port: 3001,
  },
	resolve: {
		alias: {
			react: path.resolve("./node_modules/react"),
			"react-dom": path.resolve("./node_modules/react-dom"),
			"@shared": path.resolve(process.cwd(), "src/shared"),
			"@settings": path.resolve(process.cwd(), "src/settings"),
			"@dashboard": path.resolve(process.cwd(), "src/dashboard"),
			"@clients": path.resolve(process.cwd(), "src/clients"),
			"@catalog": path.resolve(process.cwd(), "src/catalog"),
			"@integrations": path.resolve(process.cwd(), "src/integrations"),
			"@layout": path.resolve(process.cwd(), "src/layout"),
			"@pricing": path.resolve(process.cwd(), "src/pricing"),
			'@http': path.resolve(process.cwd(), "src/shared/infrastructure/services/api-http.service.ts"),
		},
	},
	source: {
		define: {
			// Expose all REACT_APP_* environment variables to the browser
			"process.env": JSON.stringify(
				Object.keys(process.env)
					.filter((key) => key.startsWith("REACT_APP_"))
					.reduce(
						(obj, key) => {
							const value = process.env[key];
							if (value !== undefined) {
								obj[key] = value;
							}
							return obj;
						},
						{} as Record<string, string>
					)
			),
		},
	},
});
