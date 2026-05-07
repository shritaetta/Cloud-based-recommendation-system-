import pandas as pd
import logging
import uuid
import os
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.internship import Internship

logger = logging.getLogger(__name__)

async def import_data(db: AsyncSession):
    # Check if table is empty
    try:
        result = await db.execute(select(Internship).limit(1))
        if result.first():
            logger.info("Internships table is not empty. Skipping dataset import.")
            return
    except Exception as e:
        logger.error(f"Error checking internships table: {e}")
        return

    # Use Docker path or local path for testing
    file_path = "/app/dataset/Book2.xlsx"
    if not os.path.exists(file_path):
        # Fallback for local run
        file_path = "dataset/Book2.xlsx"
        if not os.path.exists(file_path):
            logger.warning(f"Dataset file not found at {file_path}. Skipping import.")
            return

    logger.info("Starting dataset import from Excel...")
    
    try:
        df = pd.read_excel(file_path)
    except Exception as e:
        logger.error(f"Failed to read Excel file: {e}")
        return

    # Clean missing values
    df = df.fillna("")
    
    imported_count = 0
    skipped_count = 0
    failed_count = 0

    seen_signatures = set() # (title, domain, location)

    for index, row in df.iterrows():
        try:
            title = str(row.get('title', '')).strip().lower()
            domain = str(row.get('domain', '')).strip().lower()
            location = str(row.get('location', '')).strip().lower()
            
            if not title and not domain:
                continue # Skip completely empty rows
                
            # Uniqueness check
            signature = (title, domain, location)
            if signature in seen_signatures:
                skipped_count += 1
                continue
            seen_signatures.add(signature)

            # Process skills
            raw_skills = str(row.get('skill_tags', ''))
            skills_list = []
            if raw_skills:
                skills_list = [s.strip().lower() for s in raw_skills.split(',') if s.strip()]

            # Handle ID
            internship_id = str(row.get('id', '')).strip()
            if not internship_id:
                internship_id = str(uuid.uuid4())

            new_internship = Internship(
                id=internship_id,
                title=title,
                description=str(row.get('description', '')).strip().lower(),
                domain=domain,
                location=location,
                stipend=str(row.get('stipend', '')).strip().lower(),
                duration=str(row.get('duration', '')).strip().lower(),
                eligibility=str(row.get('eligibility', '')).strip().lower(),
                course=str(row.get('course', '')).strip().lower(),
                domain_tag=str(row.get('domain_tag', '')).strip().lower(),
                role_tag=str(row.get('role_tag', '')).strip().lower(),
                education_tag=str(row.get('education_tag', '')).strip().lower(),
                skill_tags=skills_list,
                combined_text=str(row.get('combined_text', '')).strip().lower()
            )
            
            db.add(new_internship)
            imported_count += 1
            
        except Exception as e:
            logger.error(f"Failed to import row {index}: {e}")
            failed_count += 1

    try:
        await db.commit()
        logger.info(f"Dataset import complete. Imported: {imported_count}, Skipped (duplicates): {skipped_count}, Failed: {failed_count}")
    except Exception as e:
        await db.rollback()
        logger.error(f"Failed to commit dataset to database: {e}")
