import { useState } from 'react';
import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({ status, canResetPassword, canRegister }: Props) {
    // State untuk menentukan tipe login: 'petugas' atau 'pasien'
    const [loginType, setLoginType] = useState<'petugas' | 'pasien'>('petugas');

    return (
        <>
            <Head title="Log in" />

            {/* Switcher Tipe Login */}
            <div className="flex p-1 bg-gray-100 rounded-lg mb-8 border border-gray-200">
                <button
                    type="button"
                    onClick={() => setLoginType('petugas')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                        loginType === 'petugas' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Staff / Petugas
                </button>
                <button
                    type="button"
                    onClick={() => setLoginType('pasien')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                        loginType === 'pasien' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Pasien (NIK)
                </button>
            </div>

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            {/* Input Identifier (Email atau NIK) */}
                            <div className="grid gap-2">
                                <Label htmlFor="email">
                                    {loginType === 'petugas' ? 'Email Address' : 'Nomor Induk Kependudukan (NIK)'}
                                </Label>
                                <Input
                                    id="email"
                                    type={loginType === 'petugas' ? 'email' : 'text'}
                                    name="email" // Tetap pakai name 'email' agar sinkron dengan Backend
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    placeholder={loginType === 'petugas' ? 'admin@detelayze.id' : 'Masukkan 16 digit NIK'}
                                    className="block w-full"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Input Password */}
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {canResetPassword && loginType === 'petugas' && (
                                        <TextLink href={request()} className="ml-auto text-sm" tabIndex={5}>
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox id="remember" name="remember" tabIndex={3} />
                                <Label htmlFor="remember">Keep me logged in</Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full bg-blue-600 hover:bg-blue-700"
                                tabIndex={4}
                                disabled={processing}
                            >
                                {processing && <Spinner />}
                                Log in as {loginType === 'petugas' ? 'Petugas' : 'Pasien'}
                            </Button>
                        </div>

                        {canRegister && loginType === 'pasien' && (
                            <div className="text-center text-sm text-muted-foreground">
                                Don't have an account?{' '}
                                <TextLink href={register()} tabIndex={5}>
                                    Sign up here
                                </TextLink>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <div className="mt-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Log in',
    description: 'Welcome back! Please enter your credentials.',
};