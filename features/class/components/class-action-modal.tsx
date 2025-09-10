"use client";

import { useState } from "react";
import { Role } from "@/types/auth";
import { useJoinClass } from "@/features/class/api/use-join-class";
import { useCreateClass } from "@/features/class/api/use-create-class";
import {
  createClassFormSchema,
  CreateClassFormSchema,
  joinClassFormSchema,
  JoinClassFormSchema,
} from "@/validators/class";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const ClassActionModal = ({
  onTrigger,
}: {
  onTrigger: React.ReactNode;
}) => {
  const [session] = useState({
    user: {
      id: "33hf9jdk38di",
      role: Role.TEACHER,
    },
  });
  const [open, setOpen] = useState(false);

  const formJoin = useForm<JoinClassFormSchema>({
    resolver: zodResolver(joinClassFormSchema),
    defaultValues: {
      classCode: "",
    },
  });

  const formCreate = useForm<CreateClassFormSchema>({
    resolver: zodResolver(createClassFormSchema),
    defaultValues: {
      name: "",
      description: "",
      classCode: "",
    },
  });

  const { mutate: joinClass, isPending: isJoining } = useJoinClass({
    onSuccess: () => {
      formJoin.reset();
      setOpen(false);
      toast.success("Joined class successfully");
    },
    onError: (e) => {
      toast.error(e.message || "Something went wrong");
      console.error(e);
    },
  });

  const { mutate: createClass, isPending: isCreating } = useCreateClass({
    onSuccess: () => {
      formCreate.reset();
      setOpen(false);
      toast.success("Created class successfully");
    },
    onError: (e) => {
      toast.error(e.message || "Something went wrong");
      console.error(e);
    },
  });

  const onJoiningClass = (data: JoinClassFormSchema) => {
    console.log("Submitted data:", data);
    joinClass({ classCode: data.classCode });
  };

  const onCreatingClass = (data: CreateClassFormSchema) => {
    console.log("Submitted data:", data);
    createClass({ data, teacherId: session.user.id });
  };

  const handleClose = () => {
    setOpen(false);
    formCreate.reset();
    formJoin.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{onTrigger}</DialogTrigger>
      <DialogContent className="rounded-2xl sm:max-w-lg">
        <DialogHeader className="border-b pb-6">
          <DialogTitle className="text-center text-xl">
            {session.user.role === Role.STUDENT
              ? " Join Class"
              : "Create a Class"}
          </DialogTitle>
        </DialogHeader>
        {session.user.role === Role.STUDENT ? (
          <Form {...formJoin}>
            <form
              onSubmit={formJoin.handleSubmit(onJoiningClass)}
              className="space-y-6"
            >
              <p className="text-white">
                Get the class code from your teacher, then enter it here
              </p>

              <FormField
                control={formJoin.control}
                name="classCode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Enter your class code" />
                    </FormControl>
                    <FormMessage className="text-center" />
                  </FormItem>
                )}
              />

              <p className="text-sm text-[#AAAAAA]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>

              <DialogFooter className="gap-4 border-t pt-6">
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  className="border-primary hover:bg-primary rounded-full hover:text-white"
                  onClick={handleClose}
                >
                  Not Now
                </Button>
                <Button type="submit" size="xs" className="rounded-full">
                  {isJoining ? "Joining..." : " Access Class"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <Form {...formCreate}>
            <form
              onSubmit={formCreate.handleSubmit(onCreatingClass)}
              className="mt-3 space-y-6 overflow-y-auto"
            >
              <FormField
                control={formCreate.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formCreate.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-24" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formCreate.control}
                name="classCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="text-[#AAAAAA]">
                The class code is used by students to join your class. It should
                include a combination of letters, numbers, and symbols.
              </p>
              <div className="flex flex-col gap-5 border-t pt-6 md:flex-row md:justify-end">
                <Button
                  type="button"
                  size={"xs"}
                  variant={"outline"}
                  className="order-2 rounded-full md:order-1"
                  onClick={handleClose}
                >
                  Not Now
                </Button>
                <Button
                  type="submit"
                  className="order-1 rounded-full md:order-2"
                  size={"xs"}
                >
                  {isCreating ? "Launching..." : "Launch Class"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
