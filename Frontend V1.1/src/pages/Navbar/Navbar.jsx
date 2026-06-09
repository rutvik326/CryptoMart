import React from "react";   
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DragHandleHorizontalIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import {
  Sheet,
  SheetContent,
  SheetDescription, // Added this import
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./Sidbar"; 

const Navbar = () => {
    const navigate = useNavigate();
    const auth = useSelector(state => state.auth);
    
    return ( 
        <div className='px-2 py-3 border-b z-50 bg-background sticky top-0 left-0 right-0 flex justify-between items-center'>
            <div className='flex items-center gap-3'>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full h-11 w-11">
                            <DragHandleHorizontalIcon className='!w-7 !h-7'/>
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-72 border-r-0 flex flex-col justify-center" side='left'>
                        <SheetHeader>
                            <SheetTitle>
                                <div className="text-3xl flex justify-center items-center gap-1">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src="/images/logo.png" />
                                        <AvatarFallback>CM</AvatarFallback>
                                    </Avatar>
                                    <div className="flex">
                                        <span className='text-orange-700 font-bold'>Crypto</span>
                                        <span className='font-bold'>Mart</span>
                                    </div>
                                </div>
                            </SheetTitle>
                            {/* FIX: Added SheetDescription to satisfy aria-describedby warning */}
                            <SheetDescription className="sr-only">
                                Main navigation menu for Crypto Mart.
                            </SheetDescription>
                        </SheetHeader>
                        <Sidebar/>
                    </SheetContent>
                </Sheet>

                <div
                    className="text-3xl flex justify-center items-center gap-1 cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="/images/logo.png" alt="Logo" />
                        <AvatarFallback>CM</AvatarFallback>
                    </Avatar>
                    <div className="flex">
                        <span className='text-orange-700 font-bold'>Crypto</span>
                        <span className='font-bold'>Mart</span>
                    </div>
                </div>
                   
                <div className="ml-9 hidden lg:block">
                    <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => navigate("/search")}
                    >
                        <MagnifyingGlassIcon className="w-5 h-5" />
                        <span>Search</span>
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="lg:hidden" 
                    onClick={() => navigate("/search")}
                >
                    <MagnifyingGlassIcon className="w-6 h-6" />
                </Button>

                <Avatar className="size-9.5 cursor-pointer" onClick={() => navigate("/profile")}>
                    <AvatarFallback className="text-2xl">
                        {auth.user?.fullName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </div>
        </div>
    );
};

export default Navbar;