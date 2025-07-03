import Image from 'next/image'
import React from 'react'

const categories = [
    {
        id: 1,
        image: "/category/photo-1532254497630-c74966e79621.jpg",
        name: "Beach",
    },
    {
        id: 2,
        image: "/category/photo-1532254497630-c74966e79621.jpg",
        name: "Beach",
    },


]



const Category = () => {
    return (
        <>
            <div className="container mx-auto">
                <div className="max-w-7xl mx-auto">
                    <div className="grid mt-10 mb-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {categories.map((category) => (
                            <div key={category.id} className="group text-center p-4  transition duration-300">
                                <div className="relative group overflow-hidden rounded-t-xl">
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        width={300}
                                        height={200}
                                        className="object-cover rounded-t-[150px]  transition-transform duration-300"
                                    />
                                    <div>
                                    <h2 className="text-[20px] font-bold bg-bodyColor py-[5px] px-[26px] rounded-r-[30px] text-primary absolute bottom-5 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in">
                                        Beach
                                    </h2>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>




                </div>
            </div>


        </>
    )
}

export default Category