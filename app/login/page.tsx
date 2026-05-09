import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRightIcon, HomeIcon, LockIcon, MailIcon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Portal Admin - Toples Laksana",
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-text-primary">
      <main className="relative z-10 mx-auto flex w-full max-w-screen-2xl grow items-center justify-center p-6">
        <div className="absolute left-8 top-8">
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full bg-white/70 font-bold uppercase tracking-widest text-text-secondary backdrop-blur-sm hover:text-primary")}
          >
            <HomeIcon className="size-3.5" />
            Beranda
          </Link>
        </div>

        <Card className="w-full max-w-[440px] overflow-hidden border-border bg-white/90 py-0 shadow-2xl shadow-primary-500/5 backdrop-blur-2xl transition-all duration-500">
          <div className="px-10 pb-6 pt-12 text-center">
            <Link href="/" className="mb-6 inline-block text-2xl font-extrabold tracking-tight text-primary-500">
              Toples Laksana
            </Link>
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-text-primary">Login Admin</h1>
          </div>

          <form className="space-y-6 px-10 pb-12" action="/admin">
            <div className="space-y-2">
              <Label className="px-1" htmlFor="email">
                Alamat Email
              </Label>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted transition-colors group-focus-within:text-primary-500">
                  <MailIcon className="size-4" />
                </div>
                <Input
                  autoFocus
                  className="h-12 bg-white pl-12 pr-4 font-bold shadow-sm"
                  id="email"
                  name="email"
                  placeholder="admin@topleslaksana.com"
                  required
                  type="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-end justify-between px-1">
                <Label htmlFor="password">Kata Sandi</Label>
              </div>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted transition-colors group-focus-within:text-primary-500">
                  <LockIcon className="size-4" />
                </div>
                <Input
                  className="h-12 bg-white pl-12 pr-12 font-bold shadow-sm"
                  id="password"
                  name="password"
                  placeholder="********"
                  required
                  type="password"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                className="group h-12 w-full font-bold uppercase tracking-widest shadow-xl shadow-primary-500/20"
                type="submit"
              >
                <span>Masuk</span>
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
