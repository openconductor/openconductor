import Button, { ButtonVariant } from '../shared/button';
import Logo from '../shared/logo';

export default function AuthLayout({
  mode,
  onGoogleSignIn,
  onDiscordSignIn,
  onGithubSignIn,
}: {
  mode: 'login' | 'signup';
  onGoogleSignIn: () => void;
  onDiscordSignIn: () => void;
  onGithubSignIn: () => void;
}) {
  return (
    <div className="h-screen bg-neutral-100 dark:bg-neutral-900">
      <div className="flex min-h-full flex-col justify-center mx-auto max-w-xs space-y-8">
        <div className="text-center justify-center items-center space-y-8">
          <div className="w-20 mx-auto">
            <Logo />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight ">
            {mode === 'login' ? 'Log in to OpenConductor' : 'Create your OpenConductor account'}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <Button
            variant={ButtonVariant.Secondary}
            onClick={(e) => {
              e.preventDefault();
              onGoogleSignIn();
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <g fill="currentColor">
                <path d="M23.507,9.818H12.052v4.909h6.492C17.507,18,14.944,19.091,12,19.091a7.091,7.091,0,1,1,4.553-12.52l3.567-3.4A12,12,0,1,0,12,24C18.617,24,24.6,19.636,23.507,9.818Z"></path>
              </g>
            </svg>
            <p className="ml-2">Continue with Google</p>
          </Button>
          <Button
            variant={ButtonVariant.Secondary}
            onClick={(e) => {
              e.preventDefault();
              onGithubSignIn();
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <g fill="currentColor">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12,0.3c-6.6,0-12,5.4-12,12c0,5.3,3.4,9.8,8.2,11.4 C8.8,23.8,9,23.4,9,23.1c0-0.3,0-1,0-2c-3.3,0.7-4-1.6-4-1.6c-0.5-1.4-1.3-1.8-1.3-1.8C2.5,17,3.7,17,3.7,17 c1.2,0.1,1.8,1.2,1.8,1.2c1.1,1.8,2.8,1.3,3.5,1c0.1-0.8,0.4-1.3,0.8-1.6c-2.7-0.3-5.5-1.3-5.5-5.9c0-1.3,0.5-2.4,1.2-3.2 C5.5,8.1,5,6.9,5.7,5.3c0,0,1-0.3,3.3,1.2c1-0.3,2-0.4,3-0.4c1,0,2,0.1,3,0.4c2.3-1.6,3.3-1.2,3.3-1.2c0.7,1.7,0.2,2.9,0.1,3.2 c0.8,0.8,1.2,1.9,1.2,3.2c0,4.6-2.8,5.6-5.5,5.9c0.4,0.4,0.8,1.1,0.8,2.2c0,1.6,0,2.9,0,3.3c0,0.3,0.2,0.7,0.8,0.6 c4.8-1.6,8.2-6.1,8.2-11.4C24,5.7,18.6,0.3,12,0.3z"
                ></path>
              </g>
            </svg>
            <p className="ml-2">Continue with Github</p>
          </Button>
          <Button
            variant={ButtonVariant.Secondary}
            onClick={(e) => {
              e.preventDefault();
              onDiscordSignIn();
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <g fill="currentColor">
                <path d="M9.328,10.068a1.337,1.337,0,0,0,0,2.664A1.278,1.278,0,0,0,10.552,11.4,1.271,1.271,0,0,0,9.328,10.068Zm4.38,0A1.337,1.337,0,1,0,14.932,11.4,1.278,1.278,0,0,0,13.708,10.068Z"></path>{' '}
                <path d="M19.54,0H3.46A2.466,2.466,0,0,0,1,2.472V18.7a2.466,2.466,0,0,0,2.46,2.472H17.068l-.636-2.22,1.536,1.428L19.42,21.72,22,24V2.472A2.466,2.466,0,0,0,19.54,0ZM14.908,15.672s-.432-.516-.792-.972a3.787,3.787,0,0,0,2.172-1.428,6.867,6.867,0,0,1-1.38.708,7.9,7.9,0,0,1-1.74.516,8.406,8.406,0,0,1-3.108-.012A10.073,10.073,0,0,1,8.3,13.968a6.846,6.846,0,0,1-1.368-.708,3.732,3.732,0,0,0,2.1,1.416c-.36.456-.8,1-.8,1a4.351,4.351,0,0,1-3.66-1.824,16.07,16.07,0,0,1,1.728-7,5.934,5.934,0,0,1,3.372-1.26l.12.144A8.1,8.1,0,0,0,6.628,7.308s.264-.144.708-.348A9.012,9.012,0,0,1,10.06,6.2a1.182,1.182,0,0,1,.2-.024,10.153,10.153,0,0,1,2.424-.024A9.782,9.782,0,0,1,16.3,7.308a7.986,7.986,0,0,0-2.988-1.524l.168-.192a5.934,5.934,0,0,1,3.372,1.26,16.07,16.07,0,0,1,1.728,7A4.386,4.386,0,0,1,14.908,15.672Z"></path>
              </g>
            </svg>
            <p className="ml-2">Continue with Discord</p>
          </Button>
        </div>
      </div>
    </div>
  );
}
