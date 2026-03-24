import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import type { Contributor } from "../data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProfileCardProps {
  c: Contributor;
}

export default function ProfileCard({ c }: ProfileCardProps) {
  const { t, i18n } = useTranslation();
  const language = i18n.language as "pt" | "en";
  const bio = c.bio[language] || c.bio.en;

  return (
    <Card key={c.name} className="max-w-[320px]">
      <CardContent>
        <div className="flex items-center flex-col justify-between gap-6">
          <Avatar className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px]">
            <AvatarImage src={c.avatar} className="object-cover object-top" />
            <AvatarFallback className="font-bold">
              {c.name.split(" ").at(0)?.charAt(0).toUpperCase()}
              {c.name.split(" ").at(-1)?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="mt-2 space-y-2">
            <p className="font-bold">{c.name}</p>

            <span>
              <p className="line-clamp-3 text-sm">{bio}</p>

              {bio.length > 90 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-primary text-sm underline">
                      {t("common.view_more")}
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[400px] max-h-[90svh]">
                    <DialogHeader className="justify-start">
                      <Avatar className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] mx-auto">
                        <AvatarImage src={c.avatar} className="object-cover object-top" />
                        <AvatarFallback className="font-bold">
                          {c.name.split(" ").at(0)?.charAt(0).toUpperCase()}
                          {c.name.split(" ").at(-1)?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <DialogTitle className="mt-6 text-left">{c.name}</DialogTitle>
                    </DialogHeader>
                    {bio}
                  </DialogContent>
                </Dialog>
              )}
            </span>

            <div className="flex items-center gap-3 mt-6">
              {c.links.map((l, index) => (
                <a
                  key={index}
                  title={l.title}
                  aria-label={l.title}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {l.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
