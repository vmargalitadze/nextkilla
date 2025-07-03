import Image from 'next/image'
import React from 'react'

const Info = () => {
    return (
        <>
            <div className="container pt-20  mx-auto">
                <div className="max-w-7xl mx-auto">
                    <div className="container">
                        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mt-10">
                            <div className="flex-shrink-0">
                                <Image src="/aboutimg1-b53ca5f6.png" alt="info" width={500} height={500} />
                            </div>
                            <div className="flex flex-col gap-8 max-w-[500px] w-full">
                                <div className="flex items-center gap-2">
                                    <i className="text-[18px] text-primary font-bold leading-5 ri-earth-line"></i>
                                    <h3 className="text-[18px] text-primary font-bold leading-5">
                                        We Are Kila Travel
                                    </h3>
                                </div>
                                <div>
                                    <h1 className="text-center lg:text-left text-[30px] sm:text-[35px] md:text-[48px] xl:text-[56px] font-black leading-tight">
                                        Exploring the World, One Destination at a Time with Us
                                    </h1>
                                    <span className="block w-32 border-t-[1.5px] border-red-900 relative mx-auto lg:mx-0">
                                        <span className="lg:hidden absolute -left-2 -top-1 w-2 h-2 bg-red-900 rounded-full"></span>
                                        <span className="absolute -right-2 -top-1 w-2 h-2 bg-red-900 rounded-full"></span>
                                    </span>
                                </div>
                                <p className="text-center lg:text-left text-paragraphColor font-normal leading-[24px]">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                                    tempor incididunt ut labore et dolore magna aliqua.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Info