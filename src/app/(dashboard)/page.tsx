"use client";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "../hooks/ReduxHook";
import { onChange } from "@/redux/slices/NewAccounts";

export default function Home() {
  const dispatch = useAppDispatch();

  return (
    <div>
      <h1>Dashboard</h1>
      <Button onClick={() => dispatch(onChange())}>Test</Button>
    </div>
  );
}
