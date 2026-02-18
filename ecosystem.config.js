module.exports = {
	apps: [
		{
			name: "quality-api",
			script: "dist/server.js",
			instances: 1,
			exec_mode: "fork",
			env: {
				NODE_ENV: "production",
				SERVICE_NAME: "quality-api",
			},
		},
		{
			name: "quality-worker-email",
			script: "dist/workers/worker.bootstrap.js",
			instances: 1,
			exec_mode: "fork",
			env: {
				NODE_ENV: "production",
				SERVICE_NAME: "quality-worker-email",
			},
		},
	],
};
