module.exports = {
	apps: [
		{
			name: "quality-api",
			script: "dist/src/server.js",
			instances: "1",
			exec_mode: "cluster",
			watch: false,
			env: {
				NODE_ENV: "development",
				SERVICE_NAME: "quality-api",
			},
			env_production: {
				NODE_ENV: "production",
				SERVICE_NAME: "quality-api",
			},
		},
		{
			name: "quality-worker",
			script: "dist/src/infra/queue/queue.worker.js",
			instances: 1,
			exec_mode: "fork",
			watch: false,
			env: {
				NODE_ENV: "development",
				SERVICE_NAME: "quality-worker",
			},
			env_production: {
				NODE_ENV: "production",
				SERVICE_NAME: "quality-worker",
			},
		},
	],
};
