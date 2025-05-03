import React from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheck, Star } from 'lucide-react';

const Card = ({ project }) => {
    const progress = Math.floor(Math.random() * 101);

    return (
        <div className="w-full max-w-sm rounded-xl overflow-hidden shadow-lg bg-white relative group transition-all duration-300 hover:shadow-xl font-sans">
            {/* Featured Badge */}
            {project.featured && (
                <div className="absolute top-4 right-4 bg-coral text-white px-3 py-1 rounded-full text-sm font-bold z-10 shadow-md flex items-center gap-1">
                    <Star size={14} />
                    Featured
                </div>
            )}

            {/* Project Image with overlay gradient */}
            <div className="relative h-56 overflow-hidden">
                <img
                    src={project.Images[0]}
                    alt={project.project_name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                {/* Category tag positioned over image */}
                <div className="absolute bottom-4 left-4">
                    <span className="text-sm font-medium px-3 py-1 rounded-full bg-white text-gray-800 shadow-sm">
                        {project.Category}
                    </span>
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    {/* Company info with verification badge */}
                    <div className="flex items-center gap-1 text-sm font-bold text-gray-800">
                        {project.CompanyId._id.verified && (
                            <BadgeCheck className="h-6 w-6 text-coral" />
                        )}
                        <span>{project.CompanyId._id.fullName}</span>
                    </div>

                    {/* Project completion percentage */}

                </div>

                {/* Project title */}
                <h3 className="text-xl font-bold mb-3 text-gray-900 leading-tight">
                    {project.project_name}
                </h3>

                {/* Project description */}
                <p className="text-gray-600 text-lg mb-5 line-clamp-3 ">
                    {project.project_description}
                </p>

                {/* Progress Bar */}
                <div className="mb-5">
                    <div className="flex justify-between  mb-2">
                        <span className="font-semibold text-gray-900">
                            NRP₹ {project.fund_amount.toLocaleString()}
                        </span>
                    </div>
                    <div className="w-full h-2 bg-card-alt-bg rounded-full overflow-hidden">
                        <div
                            className="h-full bg-coral rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                    </div>
                </div>

                {/* Call to action button */}
                <Link
                    to={`/project/detail/${project._id}`}
                    state={{ project: project }}
                    className="block w-full"
                >
                    <button className="w-full py-3 rounded-lg bg-coral text-white hover:bg-button-hover transition-all duration-300 font-semibold shadow-md">
                        View Project
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Card;
