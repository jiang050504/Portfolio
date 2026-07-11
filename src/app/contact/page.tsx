"use client";

import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import GlowCard from "@/components/ui/GlowCard";
import {
  Mail,
  Globe,
  Link2,
  MessageCircle,
  MapPin,
} from "lucide-react";
import { useContent } from "@/context/ContentContext";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  mail: Mail,
  globe: Globe,
  link2: Link2,
  "message-circle": MessageCircle,
  "map-pin": MapPin,
};

export default function ContactPage() {
  const { content } = useContent();
  const {
    contactTitle,
    contactSubtitle,
    contacts,
    contactStatusTitle,
    contactStatusText,
  } = content;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-6">
        <SectionTitle title={contactTitle} subtitle={contactSubtitle} />

        {/* Contact cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {contacts.map((contact, index) => {
            const Icon = iconMap[contact.icon] || Globe;
            return (
              <motion.a
                key={contact.label}
                href={contact.href}
                target={contact.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-sm transition-all hover:border-cyan-500/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.06)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.05] text-cyan-400">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">{contact.label}</p>
                  <p className="text-sm font-medium text-zinc-300 transition-colors group-hover:text-zinc-100">
                    {contact.value}
                  </p>
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Availability card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <GlowCard>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200">
                  {contactStatusTitle}
                </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  {contactStatusText}
                </p>
              </div>
            </div>
          </GlowCard>
        </motion.div>
      </div>
    </div>
  );
}
