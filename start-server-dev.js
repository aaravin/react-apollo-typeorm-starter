const args = [ 'run start:dev' ];
const opts = { stdio: 'inherit', cwd: 'server', shell: true };
require('child_process').spawn('npm', args, opts);