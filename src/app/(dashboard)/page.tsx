"use client";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "../hooks/ReduxHook";
import { onOpen } from "@/redux/slices/NewAccounts";

export default function Home() {
  const dispatch = useAppDispatch();
  return (
    <div>
      <h1>Dashboard</h1>
      <Button onClick={() => dispatch(onOpen(undefined))}>Test</Button>
    </div>
  );
}
