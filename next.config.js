/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

// Next 15 dev servers and production builds must not overwrite each other's artifacts.
module.exports = async (phase) => {
  const { PHASE_DEVELOPMENT_SERVER } = await import('next/constants.js');
  const instance = process.env.NEXT_DEV_INSTANCE || '';
  if (!['', 'e2e', 'cursos', 'cursos-preview'].includes(instance)) {
    throw new Error('NEXT_DEV_INSTANCE must identify a configured local test server');
  }
  return {
    ...nextConfig,
    distDir: phase === PHASE_DEVELOPMENT_SERVER
      ? `.next-dev${instance ? `-${instance}` : ''}`
      : '.next',
  };
};
