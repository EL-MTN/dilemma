import { Button } from '@chakra-ui/react';

export default function Home() {
	return (
		<div className="bg-white h-full">
			<div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
				<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
					Multiplayer Prisoner's Dilemma
					<br />
					Try it out for yourself.
				</h2>
				<div className="mt-10 flex items-center gap-x-6">
					<a href="/auth">
						<Button>Sign In</Button>
					</a>
					<a href="#" className="text-sm font-semibold leading-6 text-gray-900">
						Learn more <span aria-hidden="true">→</span>
					</a>
				</div>
			</div>
		</div>
	);
}
